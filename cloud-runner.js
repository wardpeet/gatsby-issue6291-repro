const execa = require("execa");

const whitelisted = ["gatsby-plugin-sharp"];

const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const runWorker = (workerFn, args) => {
  return new Promise(resolve => {
    process.nextTick(() => {
      resolve(workerFn(args));
    });
  });
};

(async () => {
  try {
    process.env.GATSBY_CLOUD_JOBS = "1";
    const proc = execa(
      "node",
      ['--max_old_space_size=8000', "node_modules/gatsby-cli/lib/index.js", "build"],
      {
        stdio: [`inherit`, `inherit`, `inherit`, `ipc`]
      }
    );

    // listen for job creation
    proc.on("message", async msg => {
      if (msg.type && msg.type === "JOB_CREATED") {
        let body;

        if (!whitelisted.includes(msg.payload.plugin.name)) {
          return proc.send({
            type: "JOB_NOT_WHITELISTED",
            payload: {
              id: msg.payload.id
            }
          });
        }

        try {
          const worker = require(`${msg.payload.plugin.name}/gatsby-worker.js`);
          const result = await runWorker(worker[msg.payload.name], {
            inputPaths: msg.payload.inputPaths,
            outputDir: msg.payload.outputDir,
            args: msg.payload.args
          });

          // call the worker function with the necessary info
          body = {
            result,
            status: "success"
          };
        } catch (err) {
          if (err instanceof Error) {
            body = {
              error: err.message
            };
          } else {
            body = {
              error: err
            };
          }
        }

        if (body.status === "success") {
          proc.send({
            type: "JOB_COMPLETED",
            payload: {
              id: msg.payload.id,
              result: body.result
            }
          });
        } else {
          proc.send({
            type: "JOB_FAILED",
            payload: {
              id: msg.payload.id,
              error: body.error
            }
          });
        }
      }
    });

    await proc;
  } catch (err) { }
})();
