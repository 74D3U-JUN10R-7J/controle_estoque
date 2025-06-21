const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../database.sqlite'),
  logging: false // coloque true se quiser ver as queries no console
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexão com o banco de dados estabelecida com sucesso! [Banco: ${sequelize.options.storage}]`);
  } catch (error) {
    console.error(`❌ Erro ao conectar ao banco: ${error.message}`);
    process.exit(1);
  }
};

connectToDatabase();

module.exports = sequelize;