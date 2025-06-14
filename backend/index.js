const express = require('express');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const { sequelize } = require('./models'); // 👈 Importa o Sequelize

const app = express();
const PORT = 3000;

app.use(express.json()); // 👈 Permite receber JSON nas requisições
app.use('/products', productRoutes); // 👈 Rotas de produtos
app.use('/suppliers', supplierRoutes); // 👈 Rotas de fornecedores

// 👇 Sincroniza o banco e aplica as associações corretamente
sequelize.sync({ alter: true }).then(() => {
  console.log("📦 Banco de dados atualizado com associações corretas!");
});

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em: http://localhost:${PORT}`);
});