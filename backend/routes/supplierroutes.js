const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.getAllSuppliers); // 👈 Retorna todos os fornecedores
router.post('/', supplierController.createSupplier); // 👈 Criar um novo fornecedor

module.exports = router;