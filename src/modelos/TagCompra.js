const sequelize = require('../sequelize');
const Tag = require('./Tag');
const Compra = require('./Compra');

const TagCompra = sequelize.define('Tag_Compra', {
    // Puedes agregar atributos adicionales si son necesarios
});

// Definir la relación muchos a muchos entre Tag y COmpra
Tag.belongsToMany(Compra, { through: TagCompra });
Compra.belongsToMany(Tag, { through: TagCompra });

module.exports = TagCompra;