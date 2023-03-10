const {Redis, } = require('ioredis');

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT
const password = process.env.REDIS_PASSWORD

const redis = new Redis({
    host,
    port: +port,
    password,
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (error) => {
    console.error('Error connecting to Redis', error);
});

module.exports = {
    redis
}

