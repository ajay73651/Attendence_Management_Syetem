const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Student = sequelize.define("student", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  attendance: Sequelize.INTEGER,
  present_date: Sequelize.DATEONLY,
});

module.exports = Student;
