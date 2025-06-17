const express = require('express');
const { validationResult, body } = require('express-validator');
const router = express.Router();
const Suppliers = require('../models/Suppliers');
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

router.get('/', async (req, res) => {
  try {
    const suppliers = await Suppliers.findAll();
    if (suppliers.length === 0) {
      return res.status(404).json({ message: 'Nenhum fornecedor encontrado.' });
    }
    res.status(200).json({ message: 'Fornecedores recuperados com sucesso!', suppliers });
  } catch (error) {
    logger.error(`Erro ao buscar fornecedores: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar fornecedores.', details: error.message });
  }
});

router.post(
  '/',
  [
    body('name').notEmpty().isLength({ min: 3 }).withMessage('O nome é obrigatório e deve ter pelo menos 3 caracteres.'),
    body('email').optional().isEmail().withMessage('O e-mail deve ser válido.'),
    body('contact').optional().isString().isLength({ min: 8, max: 20 }).withMessage('O contato deve ter entre 8 e 20 caracteres.')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Erro de validação.', details: errors.array() });
      }

      const { name, email, contact, address } = req.body;

      if (email) {
        const existingSupplier = await Suppliers.findOne({ where: { email } });
        if (existingSupplier) {
          return res.status(400).json({ error: 'Já existe um fornecedor com este e-mail!' });
        }
      }

      const newSupplier = await Suppliers.create({ name, email, contact, address });
      res.status(201).json({ message: 'Fornecedor criado com sucesso!', supplier: newSupplier });
    } catch (error) {
      logger.error(`Erro ao criar fornecedor: ${error.message}`);
      res.status(500).json({ error: 'Erro ao criar fornecedor.', details: error.message });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const supplier = await Suppliers.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Fornecedor não encontrado.' });
    }
    await supplier.update(req.body);
    res.status(200).json({ message: 'Fornecedor atualizado com sucesso!', supplier });
  } catch (error) {
    logger.error(`Erro ao atualizar fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor.', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Suppliers.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Fornecedor não encontrado.' });
    }
    await supplier.destroy();
    res.status(200).json({ message: 'Fornecedor removido com sucesso!' });
  } catch (error) {
    logger.error(`Erro ao deletar fornecedor: ${error.message}`);
    res.status(500).json({ error: 'Erro ao deletar fornecedor.', details: error.message });
  }
});

module.exports = router;