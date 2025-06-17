const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const productsRoutes = require('./routes/products');
const suppliersRoutes = require('./routes/suppliers');
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

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

const requiredEnvVars = ['DB_STORAGE'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  logger.error(`Variáveis de ambiente ausentes: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

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

app.use('/api/products', productsRoutes);
app.use('/api/suppliers', suppliersRoutes);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => res.json({ message: 'API de Controle de Estoque ativa!' }));

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Servidor iniciado na porta ${PORT} - Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
}).on('error', (err) => {
  logger.error(`Erro ao iniciar servidor: ${err.message}`);
});