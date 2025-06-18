const { Model, DataTypes } = require('sequelize');

class Supplier extends Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: DataTypes.STRING,
      contact: DataTypes.STRING,
      address: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',
      freezeTableName: true,
      timestamps: true
    });
  }

  static associate(models) {
    this.hasMany(models.Product, {
      foreignKey: 'supplierId',
      as: 'products' // ← alias coerente com boas práticas
    });
  }
}

module.exports = Supplier;
module.exports.init = Supplier.init;
module.exports.associate = Supplier.associate;