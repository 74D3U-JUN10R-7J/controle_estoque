const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Suppliers extends Model {}

Suppliers.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true, len: [3, 100] }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: { isEmail: true }
  },
  contact: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: { isNumeric: true, len: [8, 20] }
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Suppliers',
  freezeTableName: true,
  timestamps: true
});

module.exports = Suppliers;