const { Supplier } = require('./models');

const criarFornecedores = async () => {
  await Supplier.bulkCreate([
    { name: 'Fornecedor A', email: 'a@exemplo.com', phone: '1111-1111' },
    { name: 'Fornecedor B', email: 'b@exemplo.com', phone: '2222-2222' },
    { name: 'Fornecedor C', email: 'c@exemplo.com', phone: '3333-3333' },
    { name: 'Fornecedor D', email: 'd@exemplo.com', phone: '4444-4444' },
    { name: 'Fornecedor E', email: 'e@exemplo.com', phone: '5555-5555' }
  ]);
  console.log('Fornecedores criados com sucesso!');
  process.exit(); // 👈 Isso encerra o script após a execução
};

criarFornecedores();