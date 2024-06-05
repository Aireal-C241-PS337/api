const multer = require('multer');
const bucket = require('../storage/storage');

const multerStorage = multer.memoryStorage();

const upload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

exports.array = (fieldName) => upload.array(fieldName);
