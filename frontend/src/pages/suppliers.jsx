import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Suppliers = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await api.get('/api/suppliers');
        setFornecedores(response.data);
      } catch (error) {
        setErro('Erro ao carregar fornecedores.');
      } finally {
        setLoading(false);
      }
    };

    fetchFornecedores();
  }, []);

  if (loading) return <p>🔄 Carregando fornecedores...</p>;
  if (erro) return <p>❌ {erro}</p>;

  return (
    <div>
      <h2>🏢 Lista de Fornecedores</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Contato</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <td>{fornecedor.id}</td>
              <td>{fornecedor.name}</td>
              <td>{fornecedor.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Suppliers;