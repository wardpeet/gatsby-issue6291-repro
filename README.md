# gatsby-issue6291-repro

A minimal Gatsby 2 site to reproduce [this issue](https://github.com/gatsbyjs/gatsby/issues/6291).

This site is built from the standard Gatby 2 starter, the only addition being a graphql page query on the main index.jsx page that attempts to process a large number of images with gatsby-transformer-sharp.

## Instructions:
* Checkout this repo
* Install dependencies: *yarn install*
* Generate images: *yarn gen-images* executes a script that generates 6000 random images in the ./data directory. To experiment with different numbers of images you can pass a number to this command: *yarn gen-images 8000*. This step can take some time.
* Build the site: *gatsby build*
* To start over first run *yarn clean*