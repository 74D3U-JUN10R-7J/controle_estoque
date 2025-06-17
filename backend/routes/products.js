const express = require('express');
const { query, validationResult } = require('express-validator');
const router = express.Router();
const { Op } = require('sequelize');
const Products = require('../models/Products'); 
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/routes.log' })
  ]
});

router.get(
  '/',
  [
    query('minPrice').optional().isDecimal().withMessage('O preço mínimo deve ser um número decimal.'),
    query('maxPrice').optional().isDecimal().withMessage('O preço máximo deve ser um número decimal.'),
    query('page').optional().isInt({ min: 1 }).withMessage('A página deve ser um número inteiro positivo.'),
    query('limit').optional().isInt({ min: 1 }).withMessage('O limite deve ser um número inteiro positivo.')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Erro de validação.', details: errors.array() });
      }

      const { name, category, minPrice, maxPrice, sortBy, order, page, limit } = req.query;

      let filters = {};
      if (name) filters.name = { [Op.like]: `%${name}%` };
      if (category) filters.category = category;
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) filters.price[Op.lte] = parseFloat(maxPrice);
      }

      const orderConfig = sortBy ? [[sortBy, order || 'ASC']] : [['id', 'ASC']];
      const pageNum = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      const offset = (pageNum - 1) * pageSize;

      const products = await Products.findAndCountAll({
        where: filters,
        order: orderConfig,
        limit: pageSize,
        offset: offset
      });

      res.json({
        total: products.count,
        page: pageNum,
        perPage: pageSize,
        products: products.rows
      });
    } catch (error) {
      logger.error(`Erro ao buscar produtos: ${error.message}`);
      res.status(500).json({ error: 'Erro ao buscar produtos.', details: error.message });
    }
  }
);

module.exports = router;