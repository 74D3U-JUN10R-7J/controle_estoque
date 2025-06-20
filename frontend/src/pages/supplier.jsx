import React, { useEffect, useState } from 'react';
import api from '../services/api';
import * as XLSX from 'xlsx';

export default function Supplier() {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState(null);
  const [ordem, setOrdem] = useState({ campo: 'id', crescente: true });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [editando, setEditando] = useState(null); // fornecedor em edição

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = () => {
    api.get('/suppliers')
      .then(response => setFornecedores(response.data.suppliers || []))
      .catch(error => {
        console.error('Erro ao buscar fornecedores:', error);
        setErro('Erro ao carregar fornecedores.');
      });
  };

  const normalizar = texto =>
    (texto ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const fornecedoresFiltrados = fornecedores.filter(f => {
    const termo = normalizar(busca.trim());
    return (
      (f.id ?? '').toString().includes(termo) ||
      normalizar(f.razao_social).includes(termo) ||
      normalizar(f.cnpj).includes(termo) ||
      normalizar(f.cidade).includes(termo)
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

  const exportarParaExcel = () => {
    const dados = fornecedoresFiltrados.map(f => ({
      ID: f.id,
      Empresa: f.razao_social,
      CNPJ: f.cnpj,
      Cidade: f.cidade,
      UF: f.uf,
      CEP: f.cep,
      Telefone: f.telefone_fixo,
      Contato: f.telefone_celular,
      Email: f.email,
      CriadoEm: new Date(f.createdAt).toLocaleDateString()
    }));

    const planilha = XLSX.utils.json_to_sheet(dados);
    const livro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(livro, planilha, 'Fornecedores');
    XLSX.writeFile(livro, 'fornecedores.xlsx');
  };

  const excluirFornecedor = (id) => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor ID ${id}?`)) {
      api.delete(`/suppliers/${id}`)
        .then(() => {
          alert('Fornecedor excluído com sucesso.');
          carregarFornecedores();
        })
        .catch(() => alert('Erro ao excluir fornecedor.'));
    }
  };
    const fornecedoresOrdenados = ordenar(fornecedoresFiltrados);
  const totalPaginas = Math.ceil(fornecedoresOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fornecedoresPaginados = fornecedoresOrdenados.slice(inicio, inicio + itensPorPagina);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📋 Fornecedores</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por ID, nome, CNPJ ou cidade..."
          value={busca}
          onChange={e => {
            setBusca(e.target.value);
            setPaginaAtual(1);
          }}
          style={{
            padding: '8px',
            width: '100%',
            maxWidth: '320px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button onClick={exportarParaExcel} style={{ padding: '8px 12px', marginTop: '8px' }}>
          📤 Exportar .xlsx
        </button>
      </div>

      {erro ? (
        <p style={{ color: 'red' }}>{erro}</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', minWidth: '1000px' }}>
              <thead style={{ backgroundColor: '#f0f0f0' }}>
                <tr>
                  {['id', 'razao_social', 'cnpj', 'cidade', 'cep', 'telefone_fixo', 'telefone_celular', 'email', 'createdAt'].map(campo => (
                    <th
                      key={campo}
                      onClick={() => trocarOrdem(campo)}
                      style={{ padding: '10px 8px', cursor: 'pointer', borderBottom: '2px solid #ccc', textAlign: 'left' }}
                    >
                      {campo === 'razao_social' ? 'Empresa' :
                       campo === 'createdAt' ? 'Criado em' :
                       campo.replace('_', ' ').toUpperCase()}
                      {ordem.campo === campo && <span style={{ marginLeft: '4px' }}>{ordem.crescente ? '⬆️' : '⬇️'}</span>}
                    </th>
                  ))}
                  <th style={{ padding: '10px 8px', borderBottom: '2px solid #ccc' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fornecedoresPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '1rem' }}>
                      Nenhum fornecedor encontrado.
                    </td>
                  </tr>
                ) : (
                  fornecedoresPaginados.map((f, idx) => (
                    <tr key={f.id} style={{ backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                      <td style={td}>{f.id}</td>
                      <td style={td}>{f.razao_social}</td>
                      <td style={td}>{f.cnpj}</td>
                      <td style={td}>{f.cidade} - {f.uf}</td>
                      <td style={td}>{f.cep}</td>
                      <td style={td}>{f.telefone_fixo}</td>
                      <td style={td}>{f.telefone_celular}</td>
                      <td style={td}>{f.email}</td>
                      <td style={td}>{new Date(f.createdAt).toLocaleDateString()}</td>
                      <td style={{ ...td, whiteSpace: 'nowrap' }}>
                        <button onClick={() => setEditando(f)}>✏️</button>{' '}
                        <button onClick={() => excluirFornecedor(f.id)}>❌</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1}>
              ⬅️ Anterior
            </button>{' '}
            Página {paginaAtual} de {totalPaginas}{' '}
            <button onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
              Próxima ➡️
            </button>
          </div>
                    {/* Modal de edição */}
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
                padding: '1.5rem',
                width: '100%',
                maxWidth: '500px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                <h3>✏️ Editar Fornecedor #{editando.id}</h3>

                <form onSubmit={e => {
                  e.preventDefault();
                  api.put(`/suppliers/${editando.id}`, editando)
                    .then(() => {
                      alert('Fornecedor atualizado com sucesso!');
                      setEditando(null);
                      carregarFornecedores();
                    })
                    .catch(() => alert('Erro ao atualizar fornecedor.'));
                }}>
                  <label>
                    Razão Social:<br />
                    <input
                      type="text"
                      value={editando.razao_social}
                      onChange={e => setEditando({ ...editando, razao_social: e.target.value })}
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />
                  </label>

                  <label>
                    CNPJ:<br />
                    <input
                      type="text"
                      value={editando.cnpj}
                      onChange={e => setEditando({ ...editando, cnpj: e.target.value })}
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />
                  </label>

                  <label>
                    Cidade:<br />
                    <input
                      type="text"
                      value={editando.cidade}
                      onChange={e => setEditando({ ...editando, cidade: e.target.value })}
                      style={{ width: '100%', marginBottom: '1rem' }}
                    />
                  </label>

                  <div style={{ textAlign: 'right' }}>
                    <button type="submit" style={{ marginRight: '10px' }}>💾 Salvar</button>
                    <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const td = {
  padding: '8px',
  borderBottom: '1px solid #eee'
};