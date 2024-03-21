// Tag.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./Usuario'); // Importa el modelo de usuario

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});



module.exports = Tag;
