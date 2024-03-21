// productoModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./Usuario'); // Importa el modelo de usuario
const Tag = require('./Tag');
const Reporte = require('./Reporte');

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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado_venta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    mostrar_contacto: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
});

// Definir la relación Tag pertenece a Usuario con onDelete y onUpdate cascade
Producto.hasMany(Reporte, {
    foreignKey: {
        allowNull: false, // Asegura que un tag siempre tenga un usuario asociado
        onDelete: 'CASCADE', // Eliminación en cascada
        onUpdate: 'CASCADE' // Actualización en cascada
    }
    ,
    hooks: true
});
Reporte.belongsTo(Producto);

module.exports = Producto;
