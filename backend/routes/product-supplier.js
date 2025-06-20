const express = require('express');
const router = express.Router();
const { ProductSupplier, Product, Supplier } = require('../models');
const winston = require('winston');
const { Op } = require('sequelize');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/routes.log' })
  ]
});

// GET - Todos os vínculos
router.get('/', async (req, res) => {
  try {
    const relacoes = await ProductSupplier.findAll({
      include: [
        { model: Product, as: 'product', attributes: ['name'] },
        { model: Supplier, as: 'supplier', attributes: ['razao_social'] }
      ]
    });

    const resultado = relacoes.map(item => ({
      produto_id: item.produto_id,
      fornecedor_id: item.fornecedor_id,
      nomeProduto: item.product?.name || '(desconhecido)',
      nomeFornecedor: item.supplier?.razao_social || '(desconhecido)',
      quantidade: item.quantidade
    }));

    res.status(200).json(resultado);
  } catch (err) {
    logger.error(`Erro ao buscar vínculos: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao buscar vínculos.', details: err.message });
  }
});

// GET - Produtos por fornecedor
router.get('/fornecedor/:id', async (req, res) => {
  try {
    const fornecedorId = req.params.id;

    const vinculos = await ProductSupplier.findAll({
      where: { fornecedor_id: fornecedorId },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'category', 'price'] },
        { model: Supplier, as: 'supplier', attributes: ['razao_social'] }
      ]
    });

    if (vinculos.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum produto encontrado para este fornecedor.' });
    }

    const resultado = vinculos.map(item => ({
      produto_id: item.product?.id,
      nomeProduto: item.product?.name,
      categoria: item.product?.category,
      preco: item.product?.price,
      quantidade: item.quantidade,
      fornecedor_id: item.fornecedor_id,
      fornecedor_nome: item.supplier?.razao_social
    }));

    res.status(200).json(resultado);
  } catch (err) {
    logger.error(`Erro ao buscar produtos por fornecedor: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao buscar produtos por fornecedor.', detalhes: err.message });
  }
});

// GET - Fornecedores por produto
router.get('/produto/:id', async (req, res) => {
  try {
    const produtoId = req.params.id;

    const vinculos = await ProductSupplier.findAll({
      where: { produto_id: produtoId },
      include: [
        { model: Product, as: 'product', attributes: ['name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'razao_social', 'contact'] }
      ]
    });

    if (vinculos.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum fornecedor encontrado para este produto.' });
    }

    const resultado = vinculos.map(item => ({
      fornecedor_id: item.fornecedor_id,
      fornecedor_nome: item.supplier?.razao_social,
      contato: item.supplier?.contact,
      quantidade: item.quantidade,
      nomeProduto: item.product?.name
    }));

    res.status(200).json(resultado);
  } catch (err) {
    logger.error(`Erro ao buscar fornecedores por produto: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao buscar fornecedores por produto.', detalhes: err.message });
  }
});// GET - Estoques abaixo do limite
router.get('/quantidade-baixa/:limite', async (req, res) => {
  try {
    const limite = parseInt(req.params.limite);

    const resultados = await ProductSupplier.findAll({
      where: { quantidade: { [Op.lt]: limite } },
      include: [
        { model: Product, as: 'product', attributes: ['name'] },
        { model: Supplier, as: 'supplier', attributes: ['razao_social'] }
      ]
    });

    res.status(200).json(resultados.map(item => ({
      produto_id: item.produto_id,
      nomeProduto: item.product?.name,
      fornecedor_id: item.fornecedor_id,
      nomeFornecedor: item.supplier?.razao_social,
      quantidade: item.quantidade
    })));
  } catch (err) {
    logger.error(`Erro ao buscar produtos com estoque baixo: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao buscar produtos com estoque baixo.', detalhes: err.message });
  }
});

// GET - Resumo por fornecedor
router.get('/resumo', async (req, res) => {
  try {
    const resultado = await ProductSupplier.findAll({
      attributes: [
        'fornecedor_id',
        [require('sequelize').fn('SUM', require('sequelize').col('quantidade')), 'total_fornecido']
      ],
      group: ['fornecedor_id'],
      include: [
        { model: Supplier, as: 'supplier', attributes: ['razao_social'] }
      ]
    });

    res.status(200).json(resultado.map(item => ({
      fornecedor_id: item.fornecedor_id,
      nomeFornecedor: item.supplier?.razao_social,
      total_fornecido: item.dataValues.total_fornecido
    })));
  } catch (err) {
    logger.error(`Erro ao gerar resumo: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao gerar resumo.', detalhes: err.message });
  }
});

// POST - Cria novo vínculo
router.post('/', async (req, res) => {
  try {
    const { produto_id, fornecedor_id, quantidade } = req.body;
    if (!produto_id || !fornecedor_id || !quantidade) {
      return res.status(400).json({ erro: 'Informe produto_id, fornecedor_id e quantidade.' });
    }

    const existente = await ProductSupplier.findOne({
      where: { produto_id, fornecedor_id }
    });

    if (existente) {
      return res.status(409).json({ erro: 'Vínculo já existe.' });
    }

    const novo = await ProductSupplier.create({ produto_id, fornecedor_id, quantidade });
    res.status(201).json({ mensagem: 'Vínculo criado com sucesso!', dados: novo });
  } catch (err) {
    logger.error(`Erro ao criar vínculo: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao criar vínculo.', details: err.message });
  }
});

// PUT - Atualiza vínculo existente
router.put('/', async (req, res) => {
  try {
    const { produto_id, fornecedor_id, quantidade } = req.body;
    if (!produto_id || !fornecedor_id || !quantidade) {
      return res.status(400).json({ erro: 'Informe produto_id, fornecedor_id e nova quantidade.' });
    }

    const relacao = await ProductSupplier.findOne({
      where: { produto_id, fornecedor_id }
    });

    if (!relacao) {
      return res.status(404).json({ erro: 'Vínculo não encontrado.' });
    }

    relacao.quantidade = quantidade;
    await relacao.save();

    res.status(200).json({ mensagem: 'Vínculo atualizado com sucesso.', dados: relacao });
  } catch (err) {
    logger.error(`Erro ao atualizar vínculo: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao atualizar vínculo.', details: err.message });
  }
});

// PATCH - Atualiza apenas a quantidade
router.patch('/quantidade', async (req, res) => {
  try {
    const { produto_id, fornecedor_id, quantidade } = req.body;
    if (!produto_id || !fornecedor_id || quantidade === undefined) {
      return res.status(400).json({ erro: 'Informe produto_id, fornecedor_id e quantidade.' });
    }

    const vinculo = await ProductSupplier.findOne({ where: { produto_id, fornecedor_id } });

    if (!vinculo) {
      return res.status(404).json({ erro: 'Vínculo não encontrado.' });
    }

    vinculo.quantidade = quantidade;
    await vinculo.save();

    res.status(200).json({ mensagem: 'Quantidade atualizada com sucesso.', dados: vinculo });
  } catch (err) {
    logger.error(`Erro ao atualizar quantidade: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao atualizar quantidade.', details: err.message });
  }
});

// DELETE - Remove vínculo específico
router.delete('/', async (req, res) => {
  try {
    const { produto_id, fornecedor_id } = req.body;
    if (!produto_id || !fornecedor_id) {
      return res.status(400).json({ erro: 'Informe produto_id e fornecedor_id para exclusão.' });
    }

    const excluido = await ProductSupplier.destroy({ where: { produto_id, fornecedor_id } });

    if (excluido === 0) {
      return res.status(404).json({ erro: 'Vínculo não encontrado para exclusão.' });
    }

    res.status(200).json({ mensagem: 'Vínculo removido com sucesso!' });
  } catch (err) {
    logger.error(`Erro ao excluir vínculo: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao excluir vínculo.', details: err.message });
  }
});

// DELETE - Remove todos os vínculos de um fornecedor
router.delete('/fornecedor/:id', async (req, res) => {
  try {
    const fornecedorId = req.params.id;

    const total = await ProductSupplier.destroy({ where: { fornecedor_id: fornecedorId } });

    if (total === 0) {
      return res.status(404).json({ mensagem: 'Nenhum vínculo encontrado para este fornecedor.' });
    }

    res.status(200).json({ mensagem: `Todos os vínculos do fornecedor ${fornecedorId} foram removidos (${total} registros).` });
  } catch (err) {
    logger.error(`Erro ao remover vínculos por fornecedor: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao remover vínculos.', detalhes: err.message });
  }
});

// DELETE - Remove todos os vínculos de um produto
router.delete('/produto/:id', async (req, res) => {
  try {
    const produtoId = req.params.id;

    const total = await ProductSupplier.destroy({ where: { produto_id: produtoId } });

    if (total === 0) {
      return res.status(404).json({ mensagem: 'Nenhum vínculo encontrado para este produto.' });
    }

    res.status(200).json({ mensagem: `Todos os vínculos do produto ${produtoId} foram removidos (${total} registros).` });
  } catch (err) {
    logger.error(`Erro ao remover vínculos por produto: ${err.message}`);
    res.status(500).json({ erro: 'Erro ao remover vínculos.', detalhes: err.message });
  }
});

module.exports = router;