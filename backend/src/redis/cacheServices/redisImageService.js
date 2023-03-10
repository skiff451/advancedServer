const {redis} = require("../redisClient")
const redisUploadImageService = (imageName, buffer,) => {
    return redis.set(imageName, buffer, (err, reply) => {
        if (err) throw err;
        console.log("cache reply:", reply);
    })
}
const redisDownloadImageService = (imageName) => {
     return redis.getBuffer(imageName, (err) => {
        if (err) throw err;
    });
}

module.exports = {
    redisDownloadImageService,
    redisUploadImageService
}
