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
  "https://s3.amazonaws.com/ebsi-files-new/000070dbcd51357fab7a3bc98f3ee413_mm032554.jpg",
  "https://s3.amazonaws.com/ebsi-files-new/000070dbcd51357fab7a3bc98f3ee413_mm032554.jpg",
  "https://s3.amazonaws.com/ebsi-files-new/000070dbcd51357fab7a3bc98f3ee413_mm032554.jpg",
  "https://s3.amazonaws.com/ebsi-files-new/000070dbcd51357fab7a3bc98f3ee413_mm032554.jpg",
  "https://s3.amazonaws.com/ebsi-files-new/000070dbcd51357fab7a3bc98f3ee413_mm032554.jpg",
  "https://s3.amazonaws.com/ebsi-files-new/000070dbcd51357fab7a3bc98f3ee413_mm032554.jpg"
];

const downloadInSeries = async urls => {
  return await Promise.mapSeries(urls, async url => {
    const data = await getDataUri(url);
    return data;
  });
}

async function downloadSingle(url) {
  const data = await getDataUri(url);
  return data;
}

// const downloadSingleSimpler = async url => await getDataUri(url);

const wait = tout => new Promise((res, rej) => setTimeout(() => res(), tout));

const downloadAllInParallel = async (urls, count = Infinity) => {
  return await Promise.map(urls, async url => {
    const data = await getDataUri(url);
    return data;
  }, {concurrency: count});
}

(async () => {
  const container = document.getElementById('container');
  container.innerHTML = "";

  console.time('sequentially')
  const resSequentially = await downloadAllInParallel(urls, 1);
  console.timeEnd('sequentially')

  console.time('chunkof8')
  const resInChunkOf8 = await downloadAllInParallel(urls, 8);
  console.timeEnd('chunkof8')
  
  console.time('allatonce')
  const resAllAtOnce = await downloadAllInParallel(urls);
  console.timeEnd('allatonce')
  
  
  const oneImage = await downloadSingle(urls[0]);


  // // Multiples in series
  // await Promise.mapSeries(urls, async url => {
  //   const data = await getDataUri(url);
  //   const img = document.createElement("img");
  //   img.src = data;
  //   container.appendChild(img);
  //   console.log(data);
  // });
})();
