// productoModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./Usuario'); // Importa el modelo de usuario

const Producto = sequelize.define('Producto', {
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
    precio: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado_aprobacion: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    estado_venta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    // Aquí podrías agregar más atributos del producto según tus necesidades
});

// Definir la relación Producto pertenece a Usuario
Producto.belongsTo(User, {
    foreignKey: {
        allowNull: false // Asegura que un producto siempre tenga un usuario asociado
    }
});

module.exports = Producto;
