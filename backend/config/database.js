const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const databasePath = process.env.DB_STORAGE || path.resolve(__dirname, '../database.sqlite');

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: databasePath,
  logging: process.env.LOG_LEVEL === 'debug'
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conexão com o banco de dados estabelecida! [Banco: ${databasePath}]`);
  } catch (error) {
    console.error(`Erro ao conectar ao banco: ${error.message}`);
    process.exit(1);
  }
};

connectToDatabase();

module.exports = sequelize;