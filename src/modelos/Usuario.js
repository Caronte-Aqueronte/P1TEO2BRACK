// userModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Producto = require('./Producto');
const Compra = require('./Compra');
const Moneda = require('./Moneda');
const Retiro = require('./Retiro');
const Tag = require('./Tag');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado_aprobacion: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

User.hasMany(Producto, {
    foreignKey: {
        allowNull: false, // Asegura que un producto siempre tenga un usuario asociado
        onUpdate: 'CASCADE', // Configura la actualización en cascada
        onDelete: 'CASCADE' // Configura la eliminación en cascada
    },
    hooks: true
});
// Define la asociación Producto pertenece a Usuario
Producto.belongsTo(User);
// Definir la relación Producto pertenece a Usuario
User.hasMany(Compra, {
    foreignKey: {
        allowNull: false, // Asegura que un producto siempre tenga un usuario asociado
        onUpdate: 'CASCADE', // Configura la actualización en cascada
        onDelete: 'CASCADE' // Configura la eliminación en cascada
    },
    hooks: true
});
Compra.belongsTo(User);

// Definir la relación Moneda pertenece a Usuario
User.hasMany(Moneda, {
    foreignKey: {
        allowNull: false, // Asegura que una moneda siempre tenga un usuario asociado
        onUpdate: 'CASCADE', // Configura la actualización en cascada
        onDelete: 'CASCADE', // Configura la eliminación en cascada
    },
    hooks: true
});
Moneda.belongsTo(User);

// Definir la relación Retiro pertenece a Usuario con onDelete y onUpdate cascade
User.hasMany(Retiro, {
    foreignKey: {
        allowNull: false, // Asegura que un retiro siempre tenga un usuario asociado
        onDelete: 'CASCADE', // Eliminación en cascada
        onUpdate: 'CASCADE' // Actualización en cascada
    }
    ,
    hooks: true
});
Retiro.belongsTo(User);


// Definir la relación Tag pertenece a Usuario con onDelete y onUpdate cascade
User.hasMany(Tag, {
    foreignKey: {
        allowNull: false, // Asegura que un tag siempre tenga un usuario asociado
        onDelete: 'CASCADE', // Eliminación en cascada
        onUpdate: 'CASCADE' // Actualización en cascada
    }
    ,
    hooks: true
});
Tag.belongsTo(User);



module.exports = User;
