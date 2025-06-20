import React, { useState, useEffect } from 'react';
import Cleave from 'cleave.js/react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modoEdicao = Boolean(id);

  const camposIniciais = {
    codigo: '', name: '', description: '', price: '',
    category: '', unit: '', stock: '', barcode: '',
    expirationDate: '', location: '', status: 'ativo', notes: '',
    supplierId: ''
  };

  const [form, setForm] = useState({ ...camposIniciais });
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resForn, resProduto] = await Promise.all([
          api.get('/suppliers'),
          modoEdicao ? api.get(`/products/${id}`) : Promise.resolve({ data: null })
        ]);

        setFornecedores(resForn.data.suppliers || []);

        if (resProduto.data) {
          const p = resProduto.data;
          setForm({
            ...p,
            price: p.price?.toString().replace('.', ',') || '',
            stock: p.stock?.toString() || '',
            supplierId: p.supplierId?.toString() || ''
          });
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setMensagem('❌ Erro ao carregar dados do produto.');
      }
    }
    carregarDados();
  }, [id, modoEdicao]);

  const validar = () => {
    const e = {};
    if (!form.name) e.name = 'Nome do produto é obrigatório.';
    if (!form.description) e.description = 'Descrição é obrigatória.';
    if (!form.price) e.price = 'Preço é obrigatório.';
    if (!form.category) e.category = 'Categoria obrigatória.';
    if (!form.unit) e.unit = 'Unidade de medida obrigatória.';
    if (!form.stock) e.stock = 'Quantidade em estoque é obrigatória.';
    if (!form.supplierId) e.supplierId = 'Fornecedor obrigatório.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price.replace(/[^\d,]/g, '').replace(',', '.')),
        stock: parseInt(form.stock)
      };

      if (modoEdicao) {
        await api.put(`/products/${id}`, payload);
        setMensagem('✅ Produto atualizado com sucesso!');
      } else {
        await api.post('/products', payload);
        setMensagem('✅ Produto cadastrado com sucesso!');
        setForm({ ...camposIniciais });
      }
      setErros({});
      setTimeout(() => navigate('/produtos'), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erro desconhecido.';
      setMensagem('❌ Erro ao salvar produto: ' + msg);
    }
  };

  const renderCampo = (nome, label, tipo = 'text', placeholder = '', mask = null) => (
    <div style={{ marginBottom: '1rem' }}>
      <label><strong>{label}</strong></label><br />
      {mask ? (
        <Cleave
          value={form[nome]}
          onChange={e => setForm({ ...form, [nome]: e.target.value })}
          options={mask}
          placeholder={placeholder}
        />
      ) : tipo === 'textarea' ? (
        <textarea
          value={form[nome]}
          onChange={e => setForm({ ...form, [nome]: e.target.value })}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={tipo}
          value={form[nome]}
          onChange={e => setForm({ ...form, [nome]: e.target.value })}
          placeholder={placeholder}
        />
      )}
      {erros[nome] && <div style={{ color: 'red' }}>{erros[nome]}</div>}
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h2>{modoEdicao ? '✏️ Edição de Produto' : '📦 Cadastro de Produto'}</h2>
      {mensagem && (
        <div style={{ marginBottom: '1rem', color: mensagem.startsWith('✅') ? 'green' : 'red' }}>
          {mensagem}
        </div>
      )}
      <form onSubmit={enviar}>
        {renderCampo('codigo', 'Código Interno')}
        {renderCampo('name', 'Nome do Produto*')}
        {renderCampo('description', 'Descrição*')}
        {renderCampo('price', 'Preço (R$)*', 'text', '', {
          prefix: 'R$ ',
          numeral: true,
          numeralDecimalMark: ',',
          delimiter: '.',
          numeralThousandsGroupStyle: 'thousand'
        })}
        {renderCampo('category', 'Categoria*')}
        {renderCampo('unit', 'Unidade (ex: un, kg, cx)*')}
        {renderCampo('stock', 'Estoque*', 'number')}
        {renderCampo('barcode', 'Código de Barras')}
        {renderCampo('expirationDate', 'Validade', 'date')}
        {renderCampo('location', 'Local no Estoque')}
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Status</strong></label><br />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        {renderCampo('notes', 'Observações', 'textarea')}
        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Fornecedor*</strong></label><br />
          <select
            value={form.supplierId}
            onChange={e => setForm({ ...form, supplierId: e.target.value })}
          >
            <option value="">Selecione um fornecedor</option>
            {fornecedores.map(f => (
              <option key={f.id} value={f.id}>
                {f.razao_social || `Fornecedor ${f.id}`}
              </option>
            ))}
          </select>
          {erros.supplierId && <div style={{ color: 'red' }}>{erros.supplierId}</div>}
        </div>
        <br />
        <button type="submit">
          {modoEdicao ? '💾 Salvar Alterações' : '💾 Cadastrar Produto'}
        </button>
      </form>
    </div>
  );
}