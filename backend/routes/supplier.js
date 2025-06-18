// backend/routes/supplier.js
const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const supplierController = require('../controllers/suppliersController');

// Listar todos os fornecedores
router.get('/', supplierController.getAllSuppliers);

// Obter fornecedor por ID
router.get(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  supplierController.getSupplierById
);

// Criar novo fornecedor
router.post(
  '/',
  body('name')
    .notEmpty().withMessage('Nome é obrigatório.')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres.'),
  body('email').optional().isEmail().withMessage('E-mail inválido.'),
  body('phone').optional().isString(),
  body('contact').optional().isLength({ min: 3 }).withMessage('Contato deve ter pelo menos 3 caracteres.'),
  body('address').optional().isString(),
  supplierController.createSupplier
);

// Atualizar fornecedor
router.put(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  supplierController.updateSupplier
);

// Remover fornecedor
router.delete(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  supplierController.deleteSupplier
);

module.exports = router;