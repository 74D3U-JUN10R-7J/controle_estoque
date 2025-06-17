const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Products extends Model {}

Products.init({
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
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: { notEmpty: true }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { isDecimal: true, min: 0.01 }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { isInt: true, min: 0, max: 10000 }
  },
  barcode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: { is: /^[0-9]*$/, len: [0, 20] }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Suppliers',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}, {
  sequelize,
  modelName: 'Products',
  freezeTableName: true,
  timestamps: true
});

module.exports = Products;