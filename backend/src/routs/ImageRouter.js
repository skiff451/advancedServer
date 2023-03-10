const {Router} = require('express')
const multer = require('multer');
const {
    uploadController,
    downloadController,
    noStreamDownloadController
} = require('../controllers/ImagesControllers')

const router = Router();
const upload = multer();

router.get('/upload', upload.single('image'), uploadController);
router.get('/download/:imageName', downloadController);
router.get('/download/no-stream/:imageName', noStreamDownloadController);

router.get('/upload/cached/:imageName', downloadController);

module.exports = {imageRouter: router}
