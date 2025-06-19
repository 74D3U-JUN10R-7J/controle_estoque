import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProductSupplier() {
  const [vinculos, setVinculos] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/product-supplier')
      .then(response => {
        console.log('🔗 Dados recebidos:', response.data);
        setVinculos(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar vínculos:', error);
        setErro('Erro ao carregar vínculos.');
      });
  }, []);

  return (
    <div>
      <h2>🔗 Vínculo Produto–Fornecedor</h2>
      {erro ? (
        <p style={{ color: 'red' }}>{erro}</p>
      ) : (
        <ul>
          {vinculos.map(v => (
            <li key={`${v.produto_id}-${v.fornecedor_id}`}>
              <strong>{v.nomeProduto}</strong> fornecido por <em>{v.nomeFornecedor}</em> — Quantidade: {v.quantidade}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}