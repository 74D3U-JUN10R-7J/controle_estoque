/**
 * Rotas para controle de produtos
 */
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const productController = require('../controllers/productsController');

// Listar todos os produtos com filtros opcionais
router.get('/', productController.findAll);

// Obter produto por ID
router.get(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  productController.getProductById
);

// Criar novo produto
router.post(
  '/',
  body('name').notEmpty().withMessage('Nome é obrigatório.'),
  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo.'),
  body('supplierId').isInt().withMessage('ID do fornecedor é obrigatório.'),
  productController.create
);

// Atualizar produto existente
router.put(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  body('name').optional().notEmpty().withMessage('Nome não pode ser vazio.'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo.'),
  body('supplierId').optional().isInt().withMessage('ID do fornecedor deve ser numérico.'),
  productController.update
);

// Excluir produto
router.delete(
  '/:id',
  param('id').isInt().withMessage('ID inválido!'),
  productController.delete
);

module.exports = router;