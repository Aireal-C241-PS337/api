const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
    projectId: 'capstone-aireal',
    keyFilename: path.join(__dirname, '../../credentials.json')
});

const bucket = storage.bucket('aireal-bucket');

module.exports = bucket;