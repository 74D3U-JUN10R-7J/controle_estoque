import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api from '../services/api';

export default function ProductSupplierReport() {
  const [vinculos, setVinculos] = useState([]);
  const [colunasSelecionadas, setColunasSelecionadas] = useState([]);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({ fornecedor: '', categoria: '', cidade: '' });
  const [ordem, setOrdem] = useState({ campo: '', crescente: true });

  const todasColunas = [
    { label: 'ID Produto', value: 'produto.id' },
    { label: 'Nome do Produto', value: 'produto.name' },
    { label: 'Categoria', value: 'produto.category' },
    { label: 'Preço', value: 'produto.price' },
    { label: 'Estoque', value: 'produto.stock' },
    { label: 'Data Criação Produto', value: 'produto.createdAt' },
    { label: 'Fornecedor', value: 'fornecedor.razao_social' },
    { label: 'CNPJ', value: 'fornecedor.cnpj' },
    { label: 'Cidade', value: 'fornecedor.cidade' },
    { label: 'E-mail', value: 'fornecedor.email' },
  ];

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/suppliers')
    ])
      .then(([prodRes, fornRes]) => {
        const produtos = prodRes.data.products || [];
        const fornecedores = fornRes.data.suppliers || [];

        const dados = produtos.map(p => {
          const f = fornecedores.find(forn => forn.id === p.supplierId);
          return {
            produto: p,
            fornecedor: f ?? {}
          };
        });

        setVinculos(dados);
        setColunasSelecionadas(todasColunas.slice(0, 5)); // inicia com 5 colunas
      })
      .catch(() => setErro('Erro ao carregar dados.'));
  }, []);

  const aplicarFiltros = useMemo(() => {
    return vinculos.filter(v => {
      const f = v.fornecedor;
      const p = v.produto;
      return (
        (!filtros.fornecedor || f.razao_social?.includes(filtros.fornecedor)) &&
        (!filtros.categoria || p.category?.includes(filtros.categoria)) &&
        (!filtros.cidade || f.cidade?.includes(filtros.cidade))
      );
    });
  }, [vinculos, filtros]);

  const ordenar = (lista) => {
    const { campo, crescente } = ordem;
    if (!campo) return lista;
    return [...lista].sort((a, b) => {
      const [parte, prop] = campo.split('.');
      const valA = a[parte]?.[prop]?.toString().toLowerCase() ?? '';
      const valB = b[parte]?.[prop]?.toString().toLowerCase() ?? '';
      if (valA < valB) return crescente ? -1 : 1;
      if (valA > valB) return crescente ? 1 : -1;
      return 0;
    });
  };

  const exportar = () => {
    const dados = aplicarFiltros.map(v => {
      const linha = {};
      colunasSelecionadas.forEach(col => {
        const [parte, prop] = col.value.split('.');
        linha[col.label] = v[parte]?.[prop] ?? '';
      });
      return linha;
    });
    const planilha = XLSX.utils.json_to_sheet(dados);
    const livro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(livro, planilha, 'Relatório');
    XLSX.writeFile(livro, 'relatorio_completo.xlsx');
  };

  const agrupadoPorFornecedor = useMemo(() => {
    const grupos = {};
    aplicarFiltros.forEach(v => {
      const nome = v.fornecedor?.razao_social ?? '—';
      grupos[nome] = grupos[nome] || { nome, total: 0, produtos: [] };
      grupos[nome].total += v.produto?.stock ?? 0;
      grupos[nome].produtos.push(v);
    });
    return Object.values(grupos);
  }, [aplicarFiltros]);

  const dadosGrafico = useMemo(() => {
    const categoriaMap = {};
    aplicarFiltros.forEach(v => {
      const cat = v.produto?.category ?? '—';
      categoriaMap[cat] = (categoriaMap[cat] ?? 0) + (v.produto?.stock ?? 0);
    });
    return Object.entries(categoriaMap).map(([name, value]) => ({ name, value }));
  }, [aplicarFiltros]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📋 Relatório Produto–Fornecedor</h2>

      {erro ? <p style={{ color: 'red' }}>{erro}</p> : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <Select
              isMulti
              options={todasColunas}
              value={colunasSelecionadas}
              onChange={setColunasSelecionadas}
              placeholder="🧩 Escolha as colunas"
              styles={{ container: base => ({ ...base, minWidth: '300px' }) }}
            />
            <input
              type="text"
              placeholder="🔍 Filtrar por Fornecedor"
              value={filtros.fornecedor}
              onChange={e => setFiltros(f => ({ ...f, fornecedor: e.target.value }))}
            />
            <input
              type="text"
              placeholder="📂 Categoria"
              value={filtros.categoria}
              onChange={e => setFiltros(f => ({ ...f, categoria: e.target.value }))}
            />
            <input
              type="text"
              placeholder="🏙️ Cidade"
              value={filtros.cidade}
              onChange={e => setFiltros(f => ({ ...f, cidade: e.target.value }))}
            />
            <button onClick={exportar}>📤 Exportar Excel</button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f0f0f0' }}>
              <tr>
                {colunasSelecionadas.map(col => (
                  <th
                    key={col.value}
                    onClick={() =>
                      setOrdem(prev => ({
                        campo: col.value,
                        crescente: prev.campo === col.value ? !prev.crescente : true
                      }))
                    }
                    style={{ padding: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
                  >
                    {col.label}
                    {ordem.campo === col.value && (ordem.crescente ? ' ⬆️' : ' ⬇️')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordenar(aplicarFiltros).map((v, i) => (
                <tr key={i}>
                  {colunasSelecionadas.map(col => {
                    const [parte, prop] = col.value.split('.');
                    return (
                      <td key={col.value} style={{ padding: '8px', border: '1px solid #eee' }}>
                        {v[parte]?.[prop] ?? '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: '2rem' }}>📦 Estoque por Fornecedor</h3>
          <ul>
            {agrupadoPorFornecedor.map(g => (
              <li key={g.nome}>
                <strong>{g.nome}</strong>: {g.total} unidades
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: '2rem' }}>📊 Gráfico: Estoque por Categoria</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={dadosGrafico}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3498db" name="Estoque" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}