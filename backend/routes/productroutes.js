const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts); // 👈 Listar todos os produtos
router.get('/:id', productController.getProductById); // 👈 Buscar produto por ID
router.post('/', productController.createProduct); // 👈 Criar novo produto
router.put('/:id', productController.updateProduct); // 👈 Atualizar produto por ID
router.delete('/:id', productController.deleteProduct); // 👈 Excluir produto por ID

module.exports = router;