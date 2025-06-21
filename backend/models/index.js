'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const winston = require('winston');

// Logger com Winston
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

// ✅ Aqui usamos apenas o database.js
const sequelize = require('../config/database');
const db = {};

// Carregar e inicializar modelos
const basename = path.basename(__filename);
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