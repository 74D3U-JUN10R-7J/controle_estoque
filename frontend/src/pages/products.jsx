import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Products = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get('/api/products');
        setProdutos(response.data);
      } catch (error) {
        setErro('Erro ao carregar produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) return <p>🔄 Carregando produtos...</p>;
  if (erro) return <p>❌ {erro}</p>;

  return (
    <div>
      <h2>📦 Lista de Produtos</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.name}</td>
              <td>{produto.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;