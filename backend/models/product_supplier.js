const { Model, DataTypes } = require('sequelize');

class ProductSupplier extends Model {
  static init(sequelize) {
    return super.init(
      {
        produto_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id'
          }
        },
        fornecedor_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'suppliers',
            key: 'id'
          }
        },
        quantidade: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        }
      },
      {
        sequelize,
        modelName: 'ProductSupplier',
        tableName: 'product_supplier',
        freezeTableName: true,
        timestamps: false
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Product, {
      foreignKey: 'produto_id',
      as: 'product' // alias em minúsculo, para manter consistência com include
    });

    this.belongsTo(models.Supplier, {
      foreignKey: 'fornecedor_id',
      as: 'supplier'
    });
  }
}

module.exports = ProductSupplier;
module.exports.init = ProductSupplier.init;
module.exports.associate = ProductSupplier.associate;