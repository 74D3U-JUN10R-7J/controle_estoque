// backend/models/index.js

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const winston = require('winston');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../config/config.json'))[env];
const db = {};

// Logger configurado com Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(__dirname, '../logs/database.log') })
  ]
});

// Conexão Sequelize
let sequelize;
try {
  sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize({
        dialect: config.dialect,
        storage: config.storage,
        logging: config.logging
      });

  logger.info('Conexão com banco estabelecida');
} catch (error) {
  logger.error(`Erro ao conectar ao banco: ${error.message}`);
  process.exit(1);
}

// Carregar e inicializar modelos
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.includes('.test.js')
  )
  .forEach(file => {
    try {
      const modelModule = require(path.join(__dirname, file));
      if (typeof modelModule.init === 'function') {
        const model = modelModule.init(sequelize);
        db[model.name] = model;
      } else {
        logger.warn(`Modelo ${file} não possui método init()`);
      }
    } catch (error) {
      logger.error(`Erro ao carregar modelo ${file}: ${error.message}`);
    }
  });

// Executar associações, se existirem
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;