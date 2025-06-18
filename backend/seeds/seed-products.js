// backend/seeds/seed-products.js

const db = require('../models');
const Product = db.Product;

async function seedProducts() {
  try {
    await db.sequelize.sync();

    const produtos = await Product.bulkCreate([
      { name: 'Mouse Gamer', category: 'Periférico', price: 149.99, stock: 50, barcode: '123456789012', description: 'Mouse com sensor óptico de alta precisão', supplierId: 1 },
      { name: 'Teclado Mecânico', category: 'Periférico', price: 299.90, stock: 30, barcode: '987654321098', description: 'Teclado com switches blue e retroiluminação RGB', supplierId: 1 },
      { name: 'Monitor 24"', category: 'Display', price: 899.00, stock: 20, barcode: '456123789456', description: 'Monitor full HD com painel IPS', supplierId: 3 },
      { name: 'Impressora Multifuncional', category: 'Impressora', price: 649.50, stock: 15, barcode: '741852963147', description: 'Impressora com Wi-Fi, scanner e copiadora', supplierId: 2 },
      { name: 'Pen Drive 64GB', category: 'Armazenamento', price: 39.99, stock: 100, barcode: '321654987321', description: 'Unidade flash USB 3.0 de alta velocidade', supplierId: 2 }
    ]);

    console.log(`✅ ${produtos.length} produtos inseridos com sucesso.`);
  } catch (error) {
    console.error('Erro ao fazer seed de produtos:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

seedProducts();