const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/supplier');
const productSupplierRoutes = require('./routes/product-supplier'); // <- Corrigido aqui!

const errorHandler = require('./middlewares/errorHandler');
const { createLogger, transports, format } = require('winston');

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/server.log' })
  ]
});

// Middlewares globais
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
  stream: { write: msg => logger.info(msg.trim()) }
}));

// Checagem de variáveis de ambiente obrigatórias
const requiredEnvVars = ['DB_STORAGE'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  logger.error(`Variáveis de ambiente ausentes: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Conexão com o banco
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexão com banco estabelecida!');
  } catch (error) {
    logger.error(`Erro ao conectar ao banco: ${error.message}`);
    process.exit(1);
  }
};
connectToDatabase();

sequelize.sync()
  .then(() => logger.info('Banco sincronizado com sucesso!'))
  .catch(error => {
    logger.error(`Erro ao sincronizar banco: ${error.message}`);
    process.exit(1);
  });

// Rotas principais
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/product-supplier', productSupplierRoutes); // <- Corrigido aqui também

// Rota base e favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/', (req, res) => res.json({ message: 'API de Controle de Estoque ativa!' }));

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
app.listen(PORT, () => {
  logger.info(`Servidor iniciado na porta ${PORT} - Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
}).on('error', err => {
  logger.error(`Erro ao iniciar servidor: ${err.message}`);
});