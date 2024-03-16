// Moneda.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./Usuario'); // Importa el modelo de usuario

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

// Definir la relación Producto pertenece a Usuario
Retiro.belongsTo(User, {
    foreignKey: {
        allowNull: false // Asegura que un producto siempre tenga un usuario asociado
    }
});

module.exports = Retiro;
