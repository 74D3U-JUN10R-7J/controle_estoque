import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProductList() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/products')
      .then(response => {
        const lista = Array.isArray(response.data)
          ? response.data
          : (
              response.data.produtos ??
              response.data.products ??
              Object.values(response.data).find(v => Array.isArray(v)) ??
              []
            );

        console.log('📦 Produtos resolvidos:', lista);
        setProdutos(lista);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setErro('Erro ao carregar produtos.');
      });
  }, []);

  return (
    <div>
      <h2>🖥️ Lista de Produtos</h2>
      {erro ? (
        <p style={{ color: 'red' }}>{erro}</p>
      ) : (
        <ul>
          {produtos.length === 0 ? (
            <li>Nenhum produto encontrado.</li>
          ) : (
            produtos.map(p => {
              const nome = p.name ?? 'N/A';
              const descricao = p.description ?? p.descrição ?? 'N/A';
              const preco = p.price ?? p.preço ?? 'N/A';
              const categoria = p.category ?? p.categoria ?? 'N/A';
              const estoque = p.stock ?? p.estoque ?? 'N/A';

              const fornecedorNome = p.supplier?.name ?? p.fornecedor?.nome;
              const fornecedorCNPJ = p.supplier?.cnpj ?? p.fornecedor?.cnpj;

              const fornecedor = fornecedorNome
                ? `${fornecedorNome}${fornecedorCNPJ ? ` — CNPJ: ${fornecedorCNPJ}` : ''}`
                : p.supplierId
                ? `#${p.supplierId}`
                : 'Não vinculado';

              const dataCriacao = p.createdAt ?? p["criado em"] ?? null;
              const dataFormatada = dataCriacao
                ? new Date(dataCriacao).toLocaleDateString()
                : 'N/A';

              return (
                <li key={p.id}>
                  <strong>{nome}</strong><br />
                  📝 Descrição: {descricao}<br />
                  💰 Preço: {preco !== 'N/A' ? `R$ ${Number(preco).toFixed(2)}` : 'N/A'}<br />
                  🗂️ Categoria: {categoria}<br />
                  📦 Estoque: {estoque}<br />
                  🏢 Fornecedor: {fornecedor}<br />
                  📅 Criado em: {dataFormatada}
                  <hr />
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}