const express = require('express')
const dotenv = require('dotenv')
dotenv.config(process.env.NODE_ENV === "development"
    ? {path: './.env-development'}
    : {path: './.env'})
const bodyParser = require("body-parser")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const {sequelize} = require('./src/db/sequalize')

const {itemRouter} = require('./src/routs/itemsRouter')
const {imageRouter} = require('./src/routs/ImageRouter')

const pid = process.pid
const port = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send(`Hello  World! from pid: ${pid}`)
})

app.get('/slowly', async (req, res) => {
    for (let i = 0; i < 50000000000; i++) {
        const n = i * 1500 / 0.2 - i
    }
    res.send(`slowed from pid: ${pid}`)
})

app.use('/items', itemRouter);
app.use("/image", imageRouter)


app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection with postgres DB has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    console.log(`app listening on port ${port}, pid:${pid} `)
})
