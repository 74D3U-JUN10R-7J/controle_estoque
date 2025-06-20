import React, { useEffect, useState } from 'react';
import api from '../services/api';
import * as XLSX from 'xlsx';
import ProductForm from './ProductForm';

export default function ProductList() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState(null);
  const [ordem, setOrdem] = useState({ campo: 'id', crescente: true });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/suppliers')
    ])
      .then(([produtosRes, fornecedoresRes]) => {
        const fornecedores = fornecedoresRes.data.suppliers || [];
        const lista = (produtosRes.data.products || []).map(p => {
          const fornecedor = fornecedores.find(f => f.id === p.supplierId);
          return {
            id: p.id,
            nome: p.name ?? '—',
            categoria: p.category ?? '—',
            estoque: Number(p.stock ?? 0),
            preco: Number(p.price ?? 0),
            fornecedor: {
              razao_social: fornecedor?.razao_social ?? '—',
              id: fornecedor?.id
            },
            createdAt: p.createdAt
          };
        });
        setProdutos(lista);
      })
      .catch(() => setErro('Erro ao carregar produtos e fornecedores.'));
  }, []);

  const normalizar = texto =>
    (texto ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const produtosFiltrados = produtos.filter(p => {
    const termo = normalizar(busca.trim());
    return (
      p.id?.toString().includes(termo) ||
      normalizar(p.nome).includes(termo) ||
      normalizar(p.categoria).includes(termo) ||
      normalizar(p.fornecedor.razao_social).includes(termo)
    );
  });

  const ordenar = (lista) => {
    const { campo, crescente } = ordem;
    return [...lista].sort((a, b) => {
      const valA = (a[campo] ?? '').toString().toLowerCase();
      const valB = (b[campo] ?? '').toString().toLowerCase();
      if (valA < valB) return crescente ? -1 : 1;
      if (valA > valB) return crescente ? 1 : -1;
      return 0;
    });
  };

  const trocarOrdem = (campo) => {
    setOrdem(prev => ({
      campo,
      crescente: prev.campo === campo ? !prev.crescente : true
    }));
  };

  const exportar = () => {
    const dados = produtosFiltrados.map(p => ({
      ID: p.id,
      Nome: p.nome,
      Categoria: p.categoria,
      Preço: p.preco.toFixed(2),
      Estoque: p.estoque,
      Fornecedor: p.fornecedor.razao_social,
      CriadoEm: new Date(p.createdAt).toLocaleDateString()
    }));
    const planilha = XLSX.utils.json_to_sheet(dados);
    const livro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(livro, planilha, 'Produtos');
    XLSX.writeFile(livro, 'produtos.xlsx');
  };

  const excluirProduto = (id) => {
    if (window.confirm(`Deseja excluir o produto ID ${id}?`)) {
      api.delete(`/products/${id}`)
        .then(() => {
          alert('Produto excluído com sucesso.');
          window.location.reload();
        })
        .catch(() => alert('Erro ao excluir produto.'));
    }
  };

  const produtosOrdenados = ordenar(produtosFiltrados);
  const totalPaginas = Math.ceil(produtosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const produtosPaginados = produtosOrdenados.slice(inicio, inicio + itensPorPagina);

  const td = {
    padding: '8px',
    borderBottom: '1px solid #eee'
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🖥️ Lista de Produtos</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por nome, categoria ou fornecedor..."
          value={busca}
          onChange={e => {
            setBusca(e.target.value);
            setPaginaAtual(1);
          }}
          style={{ padding: '8px', maxWidth: '300px', width: '100%' }}
        />
        <button onClick={exportar} style={{ padding: '8px 12px', marginTop: '8px' }}>
          📤 Exportar .xlsx
        </button>
      </div>

      {erro ? (
        <p style={{ color: 'red' }}>{erro}</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead style={{ background: '#f0f0f0' }}>
                <tr>
                  {['id', 'nome', 'categoria', 'estoque', 'preco', 'createdAt'].map(campo => (
                    <th
                      key={campo}
                      onClick={() => trocarOrdem(campo)}
                      style={{
                        padding: '10px 8px',
                        cursor: 'pointer',
                        borderBottom: '2px solid #ccc',
                        textAlign: 'left'
                      }}
                    >
                      {campo === 'createdAt' ? 'Criado em' : campo.charAt(0).toUpperCase() + campo.slice(1)}
                      {ordem.campo === campo && (
                        <span style={{ marginLeft: '5px' }}>{ordem.crescente ? '⬆️' : '⬇️'}</span>
                      )}
                    </th>
                  ))}
                  <th style={{ padding: '10px 8px', borderBottom: '2px solid #ccc' }}>Fornecedor</th>
                  <th style={{ padding: '10px 8px', borderBottom: '2px solid #ccc' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '1rem' }}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtosPaginados.map((p, idx) => (
                    <tr key={p.id} style={{ backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                      <td style={td}>{p.id}</td>
                      <td style={td}>{p.nome}</td>
                      <td style={td}>{p.categoria}</td>
                      <td style={td}>{p.estoque}</td>
                      <td style={td}>R$ {p.preco.toFixed(2)}</td>
                      <td style={td}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={td}>{p.fornecedor.razao_social}</td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <button onClick={() => setEditando(p)}>✏️</button>{' '}
                        <button onClick={() => excluirProduto(p.id)}>❌</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
              ⬅️ Anterior
            </button>{' '}
            Página {paginaAtual} de {totalPaginas}{' '}
            <button onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
              Próxima ➡️
            </button>
          </div>
      </>
    )}
    {editando && (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}>
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          minWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <h3>✏️ Editar Produto #{editando.id}</h3>
          <ProductForm
            dadosIniciais={editando}
            modo="editar"
            onClose={() => setEditando(null)}
          />
          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button onClick={() => setEditando(null)}>Fechar</button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}