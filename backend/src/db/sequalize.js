const {Sequelize} = require('sequelize');

const postgresHost = process.env.POSTGRES_HOST
const postgresPort = process.env.POSTGRES_PORT
const postgresDB = process.env.POSTGRES_DB
const postgresPass = process.env.POSTGRES_PASSWORD
const postgresUser = process.env.POSTGRES_USER

const sequelize = new Sequelize(postgresDB, postgresUser, postgresPass, {
    host: process.env.COMPOSE ? postgresHost : "localhost",
    dialect: "postgres",
    port: process.env.COMPOSE ? postgresPort : "5431",
});

module.exports = {sequelize}
