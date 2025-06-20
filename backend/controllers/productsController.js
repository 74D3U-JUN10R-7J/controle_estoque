const Product = require('../models/product');
const { validationResult } = require('express-validator');
const winston = require('winston');
const { Op } = require('sequelize');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/errors.log' })
  ]
});

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    if (products.length === 0) {
      return res.status(404).json({ message: 'Nenhum produto encontrado.' });
    }
    res.status(200).json({ message: 'Produtos recuperados com sucesso!', total: products.length, products });
  } catch (error) {
    logger.error(`Erro ao buscar produtos: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar produtos.', details: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado!' });
    }
    res.status(200).json(product);
  } catch (error) {
    logger.error(`Erro ao buscar produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar produto.', details: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validação falhou.', details: errors.array() });
    }

    const data = req.body;

    const newProduct = await Product.create(data);
    res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
  } catch (error) {
    logger.error(`Erro ao criar produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao criar produto.', details: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado!' });
    }

    await product.update(data);
    res.status(200).json({ message: 'Produto atualizado com sucesso!', product });
  } catch (error) {
    logger.error(`Erro ao atualizar produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar produto.', details: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado!' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    logger.error(`Erro ao excluir produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao excluir produto.', details: error.message });
  }
};