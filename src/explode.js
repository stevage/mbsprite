const Jimp = require('jimp');
const axios = require('axios');
const mkdirp = require('mkdirp');

async function explodeSprite(url, scaleSuffix, outDir) {
    function suffixedUrl(extension) {
        return url.replace(/$|(?=\?)/, scaleSuffix + extension);
    }
    mkdirp.sync(outDir);
    mkdirp.sync(outDir);
    const sprite = await Jimp.read(suffixedUrl('.png'));
    const sheet = (await axios.get(suffixedUrl('.json'))).data;
    for (let id of Object.keys(sheet)) {
        const icon = sheet[id];

        const image = new Jimp(icon.width, icon.height);
        image.blit(sprite, 0, 0, icon.x, icon.y, icon.width, icon.height);
        await image.writeAsync(`${outDir}/${id}.png`);
    }
    console.log(`Wrote ${Object.keys(sheet).length} images to ${outDir}`);
}

module.exports = async function ({
    urlOrDirectory,
    pngDirectory,
    pngDirectory2x,
}) {
    pngDirectory2x = pngDirectory2x || pngDirectory + '@2x';
    await explodeSprite(urlOrDirectory, '', pngDirectory);
    await explodeSprite(urlOrDirectory, '@2x', pngDirectory2x);
};
