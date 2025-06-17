const express = require('express');
const productsRoutes = require('./routes/products'); 
const suppliersRoutes = require('./routes/suppliers'); 
const { sequelize } = require('./models');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/products', productsRoutes);
app.use('/suppliers', suppliersRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("Banco de dados atualizado com associações corretas!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});