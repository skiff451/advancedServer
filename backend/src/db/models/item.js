const {DataTypes} = require('sequelize');
const {sequelize} = require("../sequalize")

const Item = sequelize.define('Item', {
    itemName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
}, {
    // Other model options go here
});

module.exports = {Item}
