// productoModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./Usuario'); // Importa el modelo de usuario

const Compra = sequelize.define('Compra', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mostrar_contacto: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
});

// Definir la relación Producto pertenece a Usuario
Compra.belongsTo(User, {
    foreignKey: {
        allowNull: false // Asegura que un producto siempre tenga un usuario asociado
    }
});

module.exports = Compra;
