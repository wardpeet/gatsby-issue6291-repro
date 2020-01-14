var fs = require('fs');
var path = require('path');
var imgGen = require('js-image-generator');
var ProgressBar = require('progress');

var argv = require('minimist')(process.argv.slice(2));

const imgDir = './data';

let imageCount = 3000;
if(argv._[0] && !isNaN(parseInt(argv._[0]))){
    imageCount = parseInt(argv._[0])
}

if (fs.existsSync(imgDir)){
    console.log("Images directory already exists. Skipping image generation...");
}
else {
    fs.mkdirSync(imgDir);

    console.log(`Generating ${imageCount} random images...`);
    let bar = new ProgressBar(`[:bar] :current/${imageCount} | :percent | :eta secs`, {total: imageCount, width: 30})

    for(var i=1; i<=imageCount; i++){
        imgGen.generateImage(320, 163, 50, function(err, image) {
            fs.writeFileSync(path.join(imgDir, 'image-' + i + '.jpg'), image.data);
            bar.tick();
        });
    }
}
