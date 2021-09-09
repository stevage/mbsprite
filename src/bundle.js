const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Jimp = require('jimp');
function getScaleSuffix(scale) {
    return scale === 1 ? '' : '@2x';
}
async function makeSprite(imagePaths, outDir, scale) {
    function getImageParams(image, x, y) {
        return {
            width: image.bitmap.width,
            height: image.bitmap.height,
            x,
            y,
            pixelRatio: scale,
        };
    }
    const wrapWidth = 2000;
    const spriteImage = new Jimp(10000, 10000);
    const sprite = {};
    const scaleSuffix = getScaleSuffix(scale);

    let x = 0,
        y = 0,
        width = 0,
        rowHeight = 0;
    for (const [imageId, imagePath] of imagePaths) {
        try {
            const image = await Jimp.read(imagePath);
            if (x + image.bitmap.width > wrapWidth) {
                x = 0;
                y += rowHeight;
                rowHeight = 0;
            }
            sprite[imageId] = getImageParams(image, x, y);
            spriteImage.composite(image, x, y);

            x += image.bitmap.width;
            width = Math.max(width, x);
            rowHeight = Math.max(rowHeight, image.bitmap.height);
        } catch (e) {
            console.error(`Couldn't load ${imagePath}: `, e);
        }
    }
    spriteImage.crop(0, 0, width, y + rowHeight);
    mkdirp.sync(outDir);
    const base = `${outDir}/sprite${scaleSuffix}`;
    await spriteImage.writeAsync(`${base}.png`);
    console.log(`Wrote ${base}.png`);
    fs.writeFileSync(`${base}.json`, JSON.stringify(sprite, null, 2));
    console.log(`Wrote ${base}.json`);

    return sprite;
}

async function bundle({ imageDir1x, imageDir2x, spriteDir }) {
    mkdirp.sync(spriteDir);
    const imagePaths = (dir) =>
        fs
            .readdirSync(dir)
            .filter((filename) => filename.match(/\.png$/))
            .map((filename) => [
                path.basename(filename, '.png'),
                path.join(dir, filename),
            ]);
    if (imageDir1x) {
        await makeSprite(imagePaths(imageDir1x), spriteDir, 1);
    }
    if (imageDir2x) {
        await makeSprite(imagePaths(imageDir2x), spriteDir, 2);
    }
}
module.exports = bundle;
