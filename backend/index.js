const express = require('express');
const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/supplier');
const productSupplierRoutes = require('./routes/product-supplier');
const { sequelize } = require('./models');

const app = express();
const PORT = 3000;

app.use(express.json());

// Rotas principais
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/product-supplier', productSupplierRoutes);

// Sincronização com o banco
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco de dados atualizado com associações corretas!');
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});