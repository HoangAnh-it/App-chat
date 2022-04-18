const multer = require('multer');
const path = require('path');

module.exports = function createFileStorageEngine(_path) {
    const fileStorageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/images/upload', _path));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '--' + file.originalname.replace(/ /gi, '-'));
        },
    });
    const upload = multer({ storage: fileStorageEngine });
    return upload;
}
