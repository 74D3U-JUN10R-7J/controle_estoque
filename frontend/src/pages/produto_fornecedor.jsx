import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ProdutoFornecedor = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resp = await api.get('/api/produto-fornecedor');
        setDados(resp.data);
      } catch (error) {
        setErro('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p>🔄 Carregando...</p>;
  if (erro) return <p>❌ {erro}</p>;
  if (!dados.length) return <p>📭 Nenhum vínculo encontrado.</p>;

  return (
    <div>
      <h2>🔗 Produtos & Fornecedores</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Fornecedor</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, i) => (
            <tr key={i}>
              <td>{item.nomeProduto}</td>
              <td>{item.nomeFornecedor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProdutoFornecedor;