const Sequelize = require('sequelize');

const sequelize = new Sequelize('attendence_report', 'root', 'Aj****', {
    dialect: 'mysql',
    host: 'localhost'
});


module.exports = sequelize;

