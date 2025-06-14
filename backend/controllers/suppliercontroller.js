const { Supplier } = require('../models');

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { name, contact } = req.body;
    const newSupplier = await Supplier.create({ name, contact });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
};