// TagProducto.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Tag = require('./Tag');
const Producto = require('./Producto');

const TagProducto = sequelize.define('Tag_Producto', {
    // Puedes agregar atributos adicionales si son necesarios
});

// Definir la relación muchos a muchos entre Tag y Producto con opciones de eliminación en cascada solo en la tabla de asociación
Tag.belongsToMany(Producto, { through: TagProducto });
Producto.belongsToMany(Tag, { through: TagProducto });

module.exports = TagProducto;