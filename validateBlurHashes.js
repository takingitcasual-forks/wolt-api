// I ended up with this, but the resulting encoded blurhashes are different
// than the blurhashes in restaurants.json, and I can't figure out the problem.

var { loadImage, createCanvas } = require('canvas');
const { encode } = require('blurhash');

module.exports = async restaurants => {
  let invalidCount = 0;
  for (const rest of restaurants) {
    imgBlurHash = await encodeImageToBlurhash(rest.image);
    console.log(imgBlurHash, rest.blurhash);
    if (imgBlurHash !== rest.blurhash) {
      invalidCount += 1;
    }
  }
  console.log(invalidCount + ' invalid blurhashes.');
};

const encodeImageToBlurhash = async imageUrl => {
  const image = await loadImage(imageUrl);
  const imageData = getImageData(image);
  return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};

const getImageData = image => {
  const canvas = new createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};
