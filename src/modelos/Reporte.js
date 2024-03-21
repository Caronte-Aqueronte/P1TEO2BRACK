// productoModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');


const Reporte = sequelize.define('Reporte', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    motivo_reporte: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


module.exports = Reporte;
