// Moneda.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./Usuario'); // Importa el modelo de usuario

const Moneda = sequelize.define('Moneda', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ingreso_moneda: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    retirable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
});



module.exports = Moneda;
