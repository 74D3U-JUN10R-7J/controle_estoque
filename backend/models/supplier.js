module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "O nome do fornecedor não pode estar vazio!" } }
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Sem contato" // 👈 Corrigido: valor padrão para evitar erro no SQLite
    }
  });

  // Associação com Product
  Supplier.associate = (models) => {
    Supplier.hasMany(models.Product, { foreignKey: 'supplierId', as: 'products' });
  };

  return Supplier;
};