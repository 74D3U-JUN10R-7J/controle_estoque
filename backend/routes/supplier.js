const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const supplierController = require('../controllers/suppliersController');

// 🔍 Busca avançada com filtros
router.get('/search', supplierController.searchSuppliers);

// 📋 Listar todos os fornecedores
router.get('/', supplierController.getAllSuppliers);

// 🔎 Obter fornecedor por ID
router.get(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  supplierController.getSupplierById
);

// ➕ Criar novo fornecedor
router.post(
  '/',
  body('razao_social')
    .notEmpty().withMessage('Razão social é obrigatória.')
    .isLength({ min: 3 }).withMessage('Razão social deve ter pelo menos 3 caracteres.'),
  body('cnpj').notEmpty().withMessage('CNPJ é obrigatório.'),
  body('email').optional().isEmail().withMessage('E-mail inválido.'),
  supplierController.createSupplier
);

// ✏️ Atualizar fornecedor
router.put(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  supplierController.updateSupplier
);

// ❌ Remover fornecedor
router.delete(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  supplierController.deleteSupplier
);

module.exports = router;