const { Supplier, Product } = require('./models');

const criarProdutos = async () => {
  const fornecedores = await Supplier.findAll();

  if (fornecedores.length === 0) {
    console.log("Erro: Nenhum fornecedor encontrado. Primeiro cadastre fornecedores!");
    return;
  }

  let contador = 1;
  const produtos = [];

  for (const fornecedor of fornecedores) {
    for (let i = 1; i <= 4; i++) {
      produtos.push({
        name: `Produto ${contador}`,
        description: `Descrição do Produto ${contador}`,
        price: 10 + contador,
        barcode: `78912345678${contador}`,
        supplierId: fornecedor.id // 👈 Vinculando o produto ao fornecedor
      });
      contador++;
    }
  }

  await Product.bulkCreate(produtos);
  console.log('Produtos criados com sucesso!');
  process.exit();
};

criarProdutos();