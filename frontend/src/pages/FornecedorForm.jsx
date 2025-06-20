import React, { useState } from 'react';
import Cleave from 'cleave.js/dist/cleave-react.js';
import api from '../services/api';

export default function FornecedorForm() {
  const camposIniciais = {
    cnpj: '', razao_social: '',
    cod_cnae_rf: '', desc_cnae_rf: '', cod_cnae_secundario_rf: '', desc_cnae_secundario_rf: '',
    cod_natureza_juridica: '', desc_natureza_juridica: '', inscricao_estadual: '',
    cod_cnae_sef: '', desc_cnae_sef: '', cod_cnae_secundario_sef: '', desc_cnae_secundario_sef: '',
    regime_recolhimento: '', inscricao_municipal: '',
    cod_cnae_municipal: '', desc_cnae_municipal: '',
    cod_cnae_secundario_municipal: '', desc_cnae_secundario_municipal: '',
    cidade: '', cod_ibge: '', uf: '', address: '', bairro: '', cep: '',
    telefone_fixo: '', telefone_celular: '', email: '', rota: ''
  };

  const [form, setForm] = useState({ ...camposIniciais });
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState({});

  const validar = () => {
    const novosErros = {};
    if (!form.cnpj) novosErros.cnpj = 'O CNPJ é obrigatório para identificação fiscal.';
    if (!form.razao_social) novosErros.razao_social = 'Informe a razão social da empresa.';
    if (!form.cod_natureza_juridica) novosErros.cod_natureza_juridica = 'Código da natureza jurídica é obrigatório.';
    if (!form.desc_natureza_juridica) novosErros.desc_natureza_juridica = 'Descrição da natureza jurídica é obrigatória.';
    if (!form.cod_cnae_rf || !form.desc_cnae_rf) novosErros.cod_cnae_rf = 'Código e descrição do CNAE (RF) são obrigatórios.';
    if (!form.cod_cnae_sef || !form.desc_cnae_sef) novosErros.cod_cnae_sef = 'Código e descrição do CNAE (SEF) são obrigatórios.';
    if (!form.cod_cnae_municipal || !form.desc_cnae_municipal) novosErros.cod_cnae_municipal = 'Código e descrição do CNAE municipal são obrigatórios.';
    if (!form.inscricao_estadual) novosErros.inscricao_estadual = 'A inscrição estadual é obrigatória.';
    if (!form.inscricao_municipal) novosErros.inscricao_municipal = 'A inscrição municipal é obrigatória.';
    if (!form.uf) novosErros.uf = 'Informe a unidade federativa (UF).';
    if (!form.cidade) novosErros.cidade = 'Informe a cidade do fornecedor.';
    if (!form.bairro || !form.address || !form.cep) novosErros.address = 'Endereço completo (bairro, logradouro e CEP) é obrigatório.';
    if (!form.telefone_fixo && !form.telefone_celular) novosErros.telefone = 'Informe pelo menos um telefone para contato.';
    if (!form.email || !form.email.includes('@')) novosErros.email = 'Informe um e-mail válido.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      const { data } = await api.get('/suppliers');
      const duplicado = data.suppliers.find(s => s.cnpj === form.cnpj);
      if (duplicado) return setMensagem('❌ Já existe um fornecedor com este CNPJ.');

      await api.post('/suppliers', form);
      setMensagem('✅ Fornecedor cadastrado com sucesso!');
      setForm({ ...camposIniciais });
      setErros({});
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erro desconhecido.';
      setMensagem('❌ Erro ao cadastrar fornecedor: ' + msg);
    }
  };

  const renderCampo = (nome, label, placeholder = '', type = 'text', cleaveOptions = null) => (
    <div style={{ marginBottom: '1rem' }}>
      <label><strong>{label}</strong></label><br />
      {cleaveOptions ? (
        <Cleave
          value={form[nome]}
          onChange={e => setForm({ ...form, [nome]: e.target.value })}
          options={cleaveOptions}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={form[nome]}
          onChange={e => setForm({ ...form, [nome]: e.target.value })}
          placeholder={placeholder}
          type={type}
        />
      )}
      {erros[nome] && <div style={{ color: 'red' }}>{erros[nome]}</div>}
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <h2>📋 Cadastro Completo de Fornecedor</h2>
      {mensagem && (
        <div style={{ marginBottom: '1rem', color: mensagem.startsWith('✅') ? 'green' : 'red' }}>
          {mensagem}
        </div>
      )}
      <form onSubmit={enviar}>
        <h3>🔹 Dados Cadastrais</h3>
        {renderCampo('cnpj', 'CNPJ*', '00.000.000/0000-00', 'text', {
          delimiters: ['.', '.', '/', '-'],
          blocks: [2, 3, 3, 4, 2],
          numericOnly: true
        })}
        {renderCampo('razao_social', 'Razão Social*')}
        {renderCampo('cod_natureza_juridica', 'Código Natureza Jurídica')}
        {renderCampo('desc_natureza_juridica', 'Descrição Natureza Jurídica')}
        {renderCampo('regime_recolhimento', 'Regime de Recolhimento')}

        <h3>🔹 CNAE RF</h3>
        {renderCampo('cod_cnae_rf', 'Cód. CNAE RF')}
        {renderCampo('desc_cnae_rf', 'Descrição CNAE RF')}
        {renderCampo('cod_cnae_secundario_rf', 'Cód. CNAE Secundário RF')}
        {renderCampo('desc_cnae_secundario_rf', 'Descrição CNAE Secundário RF')}

        <h3>🔹 CNAE SEF</h3>
        {renderCampo('cod_cnae_sef', 'Cód. CNAE SEF')}
        {renderCampo('desc_cnae_sef', 'Descrição CNAE SEF')}
        {renderCampo('cod_cnae_secundario_sef', 'Cód. CNAE Secundário SEF')}
        {renderCampo('desc_cnae_secundario_sef', 'Descrição CNAE Secundário SEF')}

        <h3>🔹 CNAE Municipal</h3>
        {renderCampo('cod_cnae_municipal', 'Cód. CNAE Municipal')}
        {renderCampo('desc_cnae_municipal', 'Descrição CNAE Municipal')}
        {renderCampo('cod_cnae_secundario_municipal', 'Cód. CNAE Secundário Municipal')}
        {renderCampo('desc_cnae_secundario_municipal', 'Descrição CNAE Secundário Municipal')}

        <h3>🔹 Registros Fiscais</h3>
        {renderCampo('inscricao_estadual', 'Inscrição Estadual')}
        {renderCampo('inscricao_municipal', 'Inscrição Municipal')}

        <h3>🔹 Localização</h3>
        {renderCampo('address', 'Endereço')}
        {renderCampo('bairro', 'Bairro')}
        {renderCampo('cidade', 'Cidade*')}
        {renderCampo('uf', 'UF*')}
        {renderCampo('cep', 'CEP', '00000-000', 'text', {
          delimiters: ['-'],
          blocks: [5, 3],
          numericOnly: true
        })}
        {renderCampo('cod_ibge', 'Código IBGE')}

        <h3>🔹 Contato</h3>
        {renderCampo('telefone_fixo', 'Telefone Fixo', '(00) 0000-0000', 'text', {
          delimiters: ['(', ') ', '-'],
          blocks: [0, 2, 4, 4],
          numericOnly: true
        })}
        {renderCampo('telefone_celular', 'Telefone Celular', '(00) 00000-0000', 'text', {
          delimiters: ['(', ') ', '-'],
          blocks: [0, 2, 5, 4],
          numericOnly: true
        })}
                {renderCampo('email', 'E-mail*')}
        {renderCampo('rota', 'Rota')}
        <br />
        <button type="submit">💾 Cadastrar</button>
      </form>
    </div>
  );
}