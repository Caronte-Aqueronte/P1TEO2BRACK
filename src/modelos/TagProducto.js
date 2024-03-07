const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Tag = require('./Tag');
const Producto = require('./Producto');

const TagProducto = sequelize.define('TagProducto', {
    // Puedes agregar atributos adicionales si son necesarios
});

// Definir la relación muchos a muchos entre Tag y Producto
Tag.belongsToMany(Producto, { through: TagProducto });
Producto.belongsToMany(Tag, { through: TagProducto });

module.exports = TagProducto;