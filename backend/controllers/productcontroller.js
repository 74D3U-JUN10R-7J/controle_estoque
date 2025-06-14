const { Product, Supplier } = require('../models');
const { Op } = require('sequelize');

// Listar produtos com filtros
exports.findAll = async (req, res) => {
  try {
    const { name, supplierId, minPrice, maxPrice } = req.query;
    const whereCondition = {};

    if (name) whereCondition.name = { [Op.like]: `%${name}%` }; // Busca parcial por nome
    if (supplierId) whereCondition.supplierId = supplierId; // Filtrar por fornecedor
    if (minPrice) whereCondition.price = { [Op.gte]: minPrice }; // Preço mínimo
    if (maxPrice) whereCondition.price = { ...whereCondition.price, [Op.lte]: maxPrice }; // Preço máximo

    const products = await Product.findAll({
      where: whereCondition,
      include: { model: Supplier, as: 'supplier' }, // Inclui os fornecedores nos produtos
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos!", details: error.message });
  }
};

// Criar um novo produto
exports.create = async (req, res) => {
  try {
    const { name, description, price, barcode, supplierId } = req.body;

    // Verificar se o fornecedor existe antes de criar o produto
    const supplierExists = await Supplier.findByPk(supplierId);
    if (!supplierExists) {
      return res.status(400).json({ error: "Fornecedor inválido! Fornecedor não encontrado." });
    }

    const newProduct = await Product.create({ name, description, price, barcode, supplierId });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto!", details: error.message });
  }
};

// Buscar um produto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Supplier, as: 'supplier' }] // Retorna os detalhes do fornecedor também
    });

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado!" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto!", details: error.message });
  }
};

// Atualizar um produto existente
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, barcode, supplierId } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado!" });
    }

    // Verificar se o fornecedor informado é válido
    if (supplierId) {
      const supplierExists = await Supplier.findByPk(supplierId);
      if (!supplierExists) {
        return res.status(400).json({ error: "Fornecedor inválido! Fornecedor não encontrado." });
      }
    }

    await product.update({ name, description, price, barcode, supplierId });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto!", details: error.message });
  }
};

// Excluir um produto
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado!" });
    }

    await product.destroy();
    res.status(200).json({ message: "Produto excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir produto!", details: error.message });
  }
};