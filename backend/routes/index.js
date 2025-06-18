const express = require('express');
const router = express.Router();
const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/routes.log' })
  ]
});

const registerRoute = (path, module) => {
  try {
    const routeModule = require(`./${module}`);
    router.use(path, routeModule);
    logger.info(`Rota registrada com sucesso: ${path}`);
  } catch (error) {
    logger.error(`Erro ao carregar ${module}: ${error.message}`);
  }
};

registerRoute('/products', 'product.js');
registerRoute('/suppliers', 'supplier.js');
registerRoute('/product-supplier', 'product-supplier.js');

router.get('/', (req, res) => {
  res.json({ message: 'API de Controle de Estoque ativa!' });
});

router.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada. Verifique o endpoint e tente novamente.' });
});

router.use((err, req, res, next) => {
  logger.error(`Erro no servidor: ${err.message}`);
  res.status(500).json({ error: 'Erro interno no servidor. Tente novamente mais tarde.' });
});

module.exports = router;