import Promise from 'bluebird';

function getDataUri(url, callback) {
  return new Promise ((resolve, reject) => {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        resolve(canvas.toDataURL('image/png'));
    };

    image.crossOrigin="anonymous";
    image.src = url;
  });
}

const urls = [
  "https://s3.amazonaws.com/ebsi-images/mfp_89986a2e05b2ad96122fb8bbf04ac71emm025090.jpg",
  "https://s3.amazonaws.com/ebsi-images/mfp_89986a2e05b2ad96122fb8bbf04ac71emm025090.jpg",
  "https://s3.amazonaws.com/ebsi-images/mfp_89986a2e05b2ad96122fb8bbf04ac71emm025090.jpg",
  "https://s3.amazonaws.com/ebsi-images/mfp_89986a2e05b2ad96122fb8bbf04ac71emm025090.jpg",
  "https://s3.amazonaws.com/ebsi-images/mfp_89986a2e05b2ad96122fb8bbf04ac71emm025090.jpg"
];

(async () => {
  const container = document.getElementById('container');
  container.innerHTML = "";
  await Promise.mapSeries(urls, async url => {
    const data = await getDataUri(url);
    const img = document.createElement("img");
    img.src = data;
    container.appendChild(img);
    console.log(data);
  });
})();
