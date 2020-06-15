const imageResizer = require("node-image-resizer");
const path = require("path");
const fs = require("fs");
const imageSize = require("image-size");
const { profileEnd } = require("console");

const IMAGE_EXT = [".jpg", ".png"];

function isSupportedImage(img) {
  for (const ext of IMAGE_EXT) {
    if (img.endsWith(ext)) {
      return true;
    }
  }
  return false;
}

const actualArgs = process.argv;
const commandLineArgs = actualArgs.splice(2, actualArgs.length);

if(commandLineArgs.length === 0){
    console.log("Please enter folder path as arguement");
    process.exit(0);
}


const imageFolderPath = path.resolve(commandLineArgs[0]);

const folderContent = fs.readdirSync(imageFolderPath);

const supportedImages = folderContent.filter(isSupportedImage);

// console.log(supportedImages);

const targetPath = path.join(imageFolderPath,'.','thumbnails', '/');
console.log("creating resized images at", targetPath);


(async () => {
    for(img of supportedImages) {
        const imgAbsolutePath = path.resolve(imageFolderPath, img);
        const { width, height } = imageSize(imgAbsolutePath);
        console.log('');
        console.log(`resizing ${imgAbsolutePath}`);
        console.log(`actual image size: ${width}X${height}`)
        let rWidth = width;
        let rHeight = height;
        let prefix;
        if(width > height) {
            prefix = 'tablet_'
            rHeight = 480;
            // image resizer will maintain aspect ratio so not setting width
        } else {
            prefix = 'mobile_'
            rWidth = 350;
            // image resizer will maintain aspect ratio so not setting width
        }
        console.log(`resized to: ${rWidth}X${rHeight}`);

        await imageResizer(path.resolve(imageFolderPath, img), {
            all: {
              path: targetPath,
              quality: 100,
            },
            versions: [
              {
                prefix,
                width: rWidth,
                height: rHeight,
              },
            ],
          });
    }
})();
