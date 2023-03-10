const {
    saveImage,
    saveResizedImage,
    downloadImage,
    downloadNoStreamImage
} = require("../services/imageService")
const {redis} = require("../redis/redisClient");

const uploadController = async (req, res) => {
    const image = req.file;
    const buffer = image.buffer
    const size = req.query.size;
    const imageName = image.originalname

    if (size) {
        saveResizedImage(size, imageName, buffer, res)
    } else {
        await saveImage(imageName, buffer, res)
    }
}

const downloadController = async (req, res) => {
    const imageName = req.params.imageName
    await downloadImage(imageName, res)
}

const noStreamDownloadController = (req, res) => {
    const imageName = req.params.imageName;
    downloadNoStreamImage(imageName, res)
}

module.exports = {
    uploadController,
    downloadController,
    noStreamDownloadController
}
