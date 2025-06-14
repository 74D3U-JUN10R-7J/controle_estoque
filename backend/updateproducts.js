const { Product, Supplier } = require('./models');

const corrigirProdutosSemFornecedor = async () => {
  const fornecedorPadrao = await Supplier.findOne();

  if (!fornecedorPadrao) {
    console.log("Erro: Nenhum fornecedor encontrado. Primeiro cadastre fornecedores!");
    return;
  }

  await Product.update(
    { supplierId: fornecedorPadrao.id }, // Define um fornecedor padrão para produtos sem vínculo
    { where: { supplierId: null } } // Só afeta produtos que estão sem fornecedor
  );

  console.log('Produtos sem fornecedor foram atualizados!');
  process.exit();
};

corrigirProdutosSemFornecedor();