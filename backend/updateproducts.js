const { Products, Suppliers } = require('./models');

const corrigirProdutosSemFornecedor = async () => {
  const fornecedorPadrao = await Suppliers.findOne();

  if (!fornecedorPadrao) {
    console.log("Erro: Nenhum fornecedor encontrado. Primeiro cadastre fornecedores!");
    return;
  }

  await Products.update(
    { supplierId: fornecedorPadrao.id },
    { where: { supplierId: null } }
  );

  console.log('Produtos sem fornecedor foram atualizados!');
  process.exit();
};

corrigirProdutosSemFornecedor();