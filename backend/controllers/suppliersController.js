const { Supplier } = require('../models');
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

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt', 'contact', 'address', 'deletedAt']
    });

    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'Nenhum fornecedor encontrado.' });
    }

    res.status(200).json({ message: 'Fornecedores recuperados com sucesso!', suppliers });
  } catch (error) {
    logger.error(`Erro ao buscar fornecedores: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar fornecedores.', details: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validação falhou.', details: errors.array() });
    }

    const { name, email, phone, contact, address, deletedAt } = req.body;

    const existingSupplier = await Supplier.findOne({ where: { email } });
    if (existingSupplier) {
      return res.status(400).json({ error: 'Já existe um fornecedor com este e-mail!' });
    }

    const newSupplier = await Supplier.create({ name, email, phone, contact, address, deletedAt });
    res.status(201).json({ message: 'Fornecedor criado com sucesso!', supplier: newSupplier });
  } catch (error) {
    logger.error(`Erro ao criar fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao criar fornecedor.', details: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt', 'contact', 'address', 'deletedAt']
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    }

    res.status(200).json(supplier);
  } catch (error) {
    logger.error(`Erro ao buscar fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar fornecedor.', details: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, contact, address, deletedAt } = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    }

    await supplier.update({ name, email, phone, contact, address, deletedAt });
    res.status(200).json({ message: 'Fornecedor atualizado com sucesso!', supplier });
  } catch (error) {
    logger.error(`Erro ao atualizar fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor.', details: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    }

    await supplier.destroy();
    res.status(200).json({ message: 'Fornecedor removido com sucesso!' });
  } catch (error) {
    logger.error(`Erro ao excluir fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao excluir fornecedor.', details: error.message });
  }
};