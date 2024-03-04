// sequelize.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('p1teo2', 'userteo2', '123', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});

module.exports = sequelize;