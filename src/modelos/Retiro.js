// Moneda.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Retiro = sequelize.define('Retiro', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad_retiro: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
});


module.exports = Retiro;
