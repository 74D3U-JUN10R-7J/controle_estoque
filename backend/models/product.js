const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: DataTypes.STRING,
        price: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        barcode: DataTypes.STRING,
        category: DataTypes.STRING,
        stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        supplierId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'suppliers',
            key: 'id'
          }
        }
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        freezeTableName: true,
        timestamps: true
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Supplier, {
      foreignKey: 'supplierId',
      as: 'supplier' // <- corrigido aqui
    });
  }
}

module.exports = Product;
module.exports.init = Product.init;
module.exports.associate = Product.associate;