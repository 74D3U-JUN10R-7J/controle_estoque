const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/errors.log' })
  ]
});

const isOperationalError = (err) => Boolean(err.isOperational);

module.exports = (err, req, res, next) => {
  const statusCode = err.status || 500;

  const responseError = {
    success: false,
    status: statusCode,
    message: err.message || 'Erro interno no servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method
  };

  if (isOperationalError(err)) {
    logger.warn({
      message: err.message,
      path: req.originalUrl,
      method: req.method,
      status: statusCode
    });
  } else {
    logger.error({
      message: `Erro crítico detectado: ${err.message}`,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
      status: statusCode
    });
  }

  res.status(statusCode).json(responseError);
};