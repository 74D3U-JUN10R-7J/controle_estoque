const { Sequelize } = require('sequelize');

// Configuração do banco de dados MySQL
const sequelize = new Sequelize('controle_estoque', 'root', 'sua_senha', {
  host: 'localhost',
  dialect: 'mysql', // 👈 Certifique-se de que está como 'mysql'
  logging: false
});

module.exports = sequelize;