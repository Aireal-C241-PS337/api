const bucket = require('../storage/storage');

async function uploadFiles(files) {
  const promises = files.map((file) => {
    const blob = bucket.file(Date.now() + '-' + file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream
        .on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/aireal-bucket/${blob.name}`;
          resolve(publicUrl);
        })
        .on('error', (err) => {
          reject(err);
        })
        .end(file.buffer);
    });
  });

  return Promise.all(promises);
}

module.exports = uploadFiles;