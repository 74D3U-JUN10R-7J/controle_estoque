import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Supplier() {
  const [fornecedores, setFornecedores] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/suppliers')
      .then(response => {
        const data = response.data;
        const lista =
          data.fornecedores ??
          Object.values(data).find(v => Array.isArray(v)) ??
          [];

        console.log('📦 Lista resolvida:', lista);
        setFornecedores(lista);
      })
      .catch(error => {
        console.error('Erro ao buscar fornecedores:', error);
        setErro('Erro ao carregar fornecedores.');
      });
  }, []);

  return (
    <div>
      <h2>🏢 Lista de Fornecedores</h2>
      {erro ? (
        <p style={{ color: 'red' }}>{erro}</p>
      ) : (
        <ul>
          {fornecedores.length === 0 ? (
            <li>Nenhum fornecedor encontrado.</li>
          ) : (
            fornecedores.map(f => {
              const nome = f.name ?? f.nome ?? 'N/A';
              const cnpj = f.cnpj ?? f["CNPJ"] ?? null;
              const email = f.email ?? f["e-mail"] ?? 'N/A';
              const telefone = f.phone ?? f.telefone ?? 'N/A';
              const contato = f.contact ?? f.contato ?? 'N/A';
              const endereco = f.address ?? f["endereço"] ?? 'N/A';
              const dataCriacao = f.createdAt ?? f["criado em"] ?? null;
              const dataFormatada = dataCriacao
                ? new Date(dataCriacao).toLocaleDateString()
                : 'N/A';

              return (
                <li key={f.id}>
                  <strong>{nome}</strong><br />
                  {cnpj && <>🧾 CNPJ: <span style={{ fontFamily: 'monospace' }}>{cnpj}</span><br /></>}
                  📧 E-mail: {email}<br />
                  📞 Telefone: {telefone}<br />
                  📱 Contato: {contato}<br />
                  📍 Endereço: {endereco}<br />
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