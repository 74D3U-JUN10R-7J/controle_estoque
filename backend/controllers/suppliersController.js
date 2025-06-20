const Supplier = require('../models/supplier');
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

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();

    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'Nenhum fornecedor encontrado.' });
    }

    res.status(200).json({ message: 'Fornecedores recuperados com sucesso!', suppliers });
  } catch (error) {
    logger.error(`Erro ao buscar fornecedores: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar fornecedores.', details: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    }

    res.status(200).json(supplier);
  } catch (error) {
    logger.error(`Erro ao buscar fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar fornecedor.', details: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validação falhou.', details: errors.array() });
    }

    const data = req.body;

    const existing = await Supplier.findOne({ where: { cnpj: data.cnpj } });
    if (existing) {
      return res.status(400).json({ error: 'Já existe um fornecedor com este CNPJ!' });
    }

    const newSupplier = await Supplier.create(data);
    res.status(201).json({ message: 'Fornecedor criado com sucesso!', supplier: newSupplier });
  } catch (error) {
    logger.error(`Erro ao criar fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao criar fornecedor.', details: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: 'Fornecedor não encontrado!' });
    }

    await supplier.update(data);
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

exports.searchSuppliers = async (req, res) => {
  try {
    const {
      id,
      cnpj,
      cidade,
      uf,
      cep,
      rota,
      cod_cnae_rf,
      search,
      fields
    } = req.query;

    const where = {};

    if (id) where.id = id;
    if (cnpj) where.cnpj = cnpj;
    if (cidade) where.cidade = { [Op.iLike]: `%${cidade}%` };
    if (uf) where.uf = uf.toUpperCase();
    if (cep) where.cep = cep;
    if (rota) where.rota = { [Op.iLike]: `%${rota}%` };
    if (cod_cnae_rf) where.cod_cnae_rf = cod_cnae_rf;
    if (search) {
      where.razao_social = { [Op.iLike]: `%${search}%` };
    }

    let attributes;
    if (fields) {
      attributes = fields.split(',').map(f => f.trim());
    }

    const suppliers = await Supplier.findAll({
      where,
      attributes
    });

    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'Nenhum fornecedor encontrado com os filtros aplicados.' });
    }

    return res.status(200).json({
      message: 'Fornecedores localizados com sucesso!',
      total: suppliers.length,
      suppliers
    });
  } catch (error) {
    logger.error(`Erro ao filtrar fornecedores: ${error.message}`);
    return res.status(500).json({ error: 'Erro ao filtrar fornecedores.', details: error.message });
  }
};