const { Model, DataTypes } = require('sequelize');

class Supplier extends Model {
  static init(sequelize) {
    return super.init({
      cnpj: DataTypes.STRING,
      razao_social: DataTypes.STRING,
      cod_cnae_rf: DataTypes.STRING,
      desc_cnae_rf: DataTypes.STRING,
      cod_cnae_secundario_rf: DataTypes.STRING,
      desc_cnae_secundario_rf: DataTypes.STRING,
      cod_natureza_juridica: DataTypes.STRING,
      desc_natureza_juridica: DataTypes.STRING,
      inscricao_estadual: DataTypes.STRING,
      cod_cnae_sef: DataTypes.STRING,
      desc_cnae_sef: DataTypes.STRING,
      cod_cnae_secundario_sef: DataTypes.STRING,
      desc_cnae_secundario_sef: DataTypes.STRING,
      regime_recolhimento: DataTypes.STRING,
      inscricao_municipal: DataTypes.STRING,
      cod_cnae_municipal: DataTypes.STRING,
      desc_cnae_municipal: DataTypes.STRING,
      cod_cnae_secundario_municipal: DataTypes.STRING,
      desc_cnae_secundario_municipal: DataTypes.STRING,
      cidade: DataTypes.STRING,
      cod_ibge: DataTypes.STRING,
      uf: DataTypes.STRING,
      address: DataTypes.STRING,
      bairro: DataTypes.STRING,
      cep: DataTypes.STRING,
      telefone_fixo: DataTypes.STRING,
      telefone_celular: DataTypes.STRING,
      email: DataTypes.STRING,
      rota: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    }, {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',
      freezeTableName: true,
      timestamps: true,
      paranoid: true
    });
  }

  static associate(models) {
    this.hasMany(models.Product, {
      foreignKey: 'supplierId',
      as: 'products'
    });
  }
}

module.exports = Supplier;
module.exports.init = Supplier.init;
module.exports.associate = Supplier.associate;