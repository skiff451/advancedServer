const {Router} = require('express')
const {Item} = require("../db/models/item")
const responseData = require('../utils/responseData')
const router = Router();

router.get('/', async (req, res) => {
    const items = await Item.findAll()
    res.json(responseData("all items", items));
})

router.get('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const item = await Item.findByPk(id)
        if (item) {
            res.json(responseData(`item with id:${id}`, item));
        } else {
            res.status(404).json(responseData("no item with this id", item));
        }
    } catch (e) {
        res.status(500).json(responseData("some internal error", e));
    }

})

router.post('/create', async (req, res) => {
    const itemData = req.body.item;
    try {
        const item = await Item.create(itemData);
        res.json(responseData("item created", item));
    } catch (e) {
        console.log(e.message)
        res.status(500).send(e.message)
    }

})

router.put('/update/:id', async (req, res) => {
    const itemData = req.body.item;
    const id = req.params.id
    try {
        const updatedItem = await Item.update(itemData, {
            where: {
                id
            }
        });
        if (updatedItem) {
            res.json(responseData(`item successfully updated`, id));
        } else {
            res.status(404).json(responseData("no item with this id", updatedItem));
        }
    } catch (e) {
        res.status(500).json(responseData("some internal error", e));
    }
})

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    try {
        const deletedItem = await Item.destroy( {
            where: {
                id
            }
        });
        if (deletedItem) {
            res.json(responseData(`item successfully deleted `, id));
        } else {
            res.status(404).json(responseData("no item with this id", id));
        }
    } catch (e) {
        res.status(500).json(responseData("some internal error", e));
    }
})

module.exports = {itemRouter: router}
