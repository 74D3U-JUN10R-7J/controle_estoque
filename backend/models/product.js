module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "O nome do produto não pode estar vazio!" } }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: "A descrição não pode estar vazia!" } }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { isFloat: true, min: 0 }
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  });

  // 👇 Adicionando a associação correta
  Product.associate = (models) => {
    Product.belongsTo(models.Supplier, { foreignKey: 'supplierId', as: 'supplier' });
  };

  return Product;
};