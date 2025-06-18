// backend/seeds/seed-suppliers.js

const db = require('../models');
const Supplier = db.Supplier;

async function seedSuppliers() {
  try {
    await db.sequelize.sync();

    const fornecedores = await Supplier.bulkCreate([
      { name: 'Logitech', email: 'contato@logitech.com', contact: '1132123456', address: 'Av. Tecnológica, 1000 - São Paulo' },
      { name: 'HP Brasil', email: 'suporte@hp.com', contact: '1145678900', address: 'Rua Impressoras, 200 - Campinas' },
      { name: 'Samsung', email: 'atendimento@samsung.com', contact: '1198765432', address: 'Av. Inovação, 789 - Rio de Janeiro' }
    ]);

    console.log(`✅ ${fornecedores.length} fornecedores inseridos com sucesso.`);
  } catch (error) {
    console.error('Erro ao fazer seed de fornecedores:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

seedSuppliers();