const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");
const mime = require("mime-types");
const {PassThrough, pipeline} = require("node:stream");
const responseData = require("../utils/responseData");
const {
    redisDownloadImageService,
    redisUploadImageService
} = require("../redis/cacheServices/redisImageService")


const saveImage = (imageName, buffer, res) => {
    redisUploadImageService(imageName, buffer).catch(err => {
        res.status(500)
            .json(responseData("internal error while upload image to cache", err.message))
    })

    const imagePath = path.join(__dirname, '../../images', imageName);
    const writeStream = fs.createWriteStream(imagePath);
    const passThrough = new PassThrough();
    passThrough.end(buffer);

    pipeline(passThrough, writeStream, (err) => {
        if (err) {
            console.error('Error writing image', err);
            res.status(500).json(responseData("internal error while upload image", err.message));
        } else {
            console.log('Image saved successfully!');
            res.status(200).json(responseData("image saved successfully", imageName));
        }
    });
}

const saveResizedImage = (size, imageName, buffer, res) => {
    sharp(buffer)
        .resize(+size)
        .toBuffer((err, resizedBuffer) => {
            if (err) {
                res.status(500).json(
                    responseData(
                        "internal error while resizing image", err.message
                    )
                );
            } else {
                redisUploadImageService(imageName, resizedBuffer)
                saveImage(imageName, resizedBuffer, res)
            }
        })
}

const downloadImage = async (imageName, res) => {
    const cacheBuffer = await redisDownloadImageService(imageName)
    const imagePath = path.join(__dirname, '../../images', imageName);
    let readStream

    if (cacheBuffer) {
        const mimeType = mime.lookup(imagePath)
        res.set('Content-Type', mimeType);
        readStream = new PassThrough();
        readStream.end(cacheBuffer);
    } else {
        readStream = fs.createReadStream(imagePath);
    }

    pipeline(readStream, res, (err) => {
            if (err) {
                console.error('Error sending image', err);
                res.status(500).json(responseData("internal error while download image", err.message));
            } else {
                console.log(`Image sent successfully${cacheBuffer ? " from cache" : ""}!`);
            }
        }
    );
}

const downloadNoStreamImage = (imageName, res) => {
    const imagePath = path.join(__dirname, '../../images', imageName);

    fs.readFile(imagePath, (err, data) => {
        if (!err) {
            const mimeType = mime.lookup(imagePath)
            res.set('Content-Type', mimeType);
            res.status(200).send(data);
        } else {
            console.error('Error sending image', err);
            res.status(500).json(responseData("internal error while download image", err.message));
        }
    })
}

module.exports = {
    saveImage,
    saveResizedImage,
    downloadImage,
    downloadNoStreamImage
}
