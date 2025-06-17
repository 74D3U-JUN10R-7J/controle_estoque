const { Products, Suppliers } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const winston = require('winston');

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

exports.findAll = async (req, res) => {
  try {
    const { name, supplierId, minPrice, maxPrice } = req.query;
    const whereCondition = {};

    if (name) whereCondition.name = { [Op.like]: `%${name}%` };
    if (supplierId) whereCondition.supplierId = supplierId;
    if (minPrice) whereCondition.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) whereCondition.price = { ...whereCondition.price, [Op.lte]: parseFloat(maxPrice) };

    const products = await Products.findAll({
      where: whereCondition,
      include: { model: Suppliers, as: 'supplier' }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'Nenhum produto encontrado.' });
    }

    res.status(200).json(products);
  } catch (error) {
    logger.error(`Erro ao listar produtos: ${error.message}`);
    res.status(500).json({ error: 'Erro ao listar produtos!', details: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validação falhou', details: errors.array() });
    }

    const { name, description, price, barcode, supplierId } = req.body;
    const supplierExists = await Suppliers.findByPk(supplierId);

    if (!supplierExists) {
      return res.status(400).json({ error: 'Fornecedor inválido! Fornecedor não encontrado.' });
    }

    const newProduct = await Products.create({ name, description, price, barcode, supplierId });
    res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
  } catch (error) {
    logger.error(`Erro ao criar produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao criar produto!', details: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findByPk(req.params.id, {
      include: [{ model: Suppliers, as: 'supplier' }]
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado!' });
    }

    res.json(product);
  } catch (error) {
    logger.error(`Erro ao buscar produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar produto!', details: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, barcode, supplierId } = req.body;

    const product = await Products.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado!' });
    }

    if (supplierId) {
      const supplierExists = await Suppliers.findByPk(supplierId);
      if (!supplierExists) {
        return res.status(400).json({ error: 'Fornecedor inválido! Fornecedor não encontrado.' });
      }
    }

    await product.update({ name, description, price, barcode, supplierId });
    res.status(200).json({ message: 'Produto atualizado com sucesso!', product });
  } catch (error) {
    logger.error(`Erro ao atualizar produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar produto!', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado!' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Produto excluído com sucesso!' });
  } catch (error) {
    logger.error(`Erro ao excluir produto: ${error.message}`);
    res.status(500).json({ error: 'Erro ao excluir produto!', details: error.message });
  }
};