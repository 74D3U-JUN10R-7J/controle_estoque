
# 📦 Controle de Estoque

Projeto desenvolvido por **José Tadeu Nunes de Araujo Junior**, com base em experiência prática e conhecimento aplicado em automação de processos e gestão de dados.

> ⚠️ Este repositório tem finalidade **estritamente acadêmica**, sendo parte do processo de certificação de competências no curso de Análise e Desenvolvimento de Sistemas.

---

## 🎓 Contexto Acadêmico

Projeto apresentado como requisito da disciplina **Projeto Integrador** – 4º semestre de Análise e Desenvolvimento de Sistemas (Gran Faculdade).

> 🔐 **Nota:** A instituição de ensino **não possui qualquer direito sobre o código-fonte, estrutura de dados ou lógica de negócio aqui implementados**. A propriedade intelectual é integral e exclusivamente do autor **José Tadeu Nunes de Araujo Junior**

---

## 🧭 Objetivo do Sistema

O sistema tem por finalidade **gerenciar produtos e fornecedores**, permitindo operações de:

- Cadastro e edição de produtos e fornecedores
- Associação entre produtos e seus respectivos fornecedores
- Controle de estoque
- Exportação de dados para planilhas `.xlsx`

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React (com Axios e Vite)
- **Backend:** Node.js com Express e Sequelize
- **Banco de Dados:** SQLite (estruturado para migração futura via Sequelize)
- **Ambiente de desenvolvimento:** Visual Studio Code, Git e Insomnia

---

## ⚖️ Termos de Uso e Direitos Autorais

Todos os direitos reservados a **José Tadeu Nunes de Araujo Junior** A reprodução, redistribuição ou modificação deste projeto — total ou parcial — sem autorização formal do autor constitui violação de propriedade intelectual e poderá acarretar medidas legais cabíveis.

---

## 📁 Repositório

🔗 [Acesse o repositório no GitHub](https://github.com/74D3U-JUN10R-7J/controle_estoque)

---

🛠️ Desenvolvido com dedicação, foco acadêmico e uma boa dose de automação aplicada — transformando planilhas em soluções reais de controle de estoque.

---

## 📘 Manual de Instalação e Uso (Apêndice para Avaliadores)

### ⚙️ Pré-requisitos

Antes de executar o sistema, verifique se você possui:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Um terminal como CMD, PowerShell ou terminal do VS Code
- Um gerenciador de pacotes (como `npm` ou `yarn`)

---

### 🗂️ Clonando o Repositório

```bash
git clone https://github.com/74D3U-JUN10R-7J/controle_estoque.git
cd controle_estoque



🖥️ Backend — Configuração
- Acesse a pasta do backend:
cd backend


- Instale as dependências:
npm install


- Inicie o servidor:
npm run dev


O backend será executado em http://localhost:3000/.


🌐 Frontend — Execução
- Abra um novo terminal e vá para a pasta do frontend:
cd frontend


- Instale as dependências:
npm install


- Rode a aplicação:
npm run dev


O frontend estará disponível em http://localhost:5173/.


🧪 Navegação e Funcionalidades
Após iniciar o frontend e backend, acesse http://localhost:5173/ para usar o sistema. As principais páginas são:
- / — Tela inicial de boas-vindas.
- /product — Lista de produtos com filtros, exportação Excel, edição e exclusão.
- /produto_novo — Cadastro completo de produto (nome, categoria, estoque, fornecedor etc).
- /supplier — Lista de fornecedores com busca por CNPJ, cidade e exportação.
- /fornecedor_novo — Cadastro completo de fornecedor com dados fiscais, CNAEs, e localização.
- /product_supplier — Tela de vínculo entre produtos e fornecedores.
- /product_supplier_report — Relatórios com filtros, exportação, totais por fornecedor e gráfico por categoria.

📋 Funcionalidades Implementadas
- Filtros inteligentes e busca contextual.
- Exportação de dados para .xlsx nas principais telas.
- Cadastro completo com validações.
- Associação produto–fornecedor com rastreabilidade.
- Gráfico por categoria no relatório principal.
- Página com estatísticas de estoque por fornecedor.

🧭 Fluxo Sugerido para Avaliação
- Acesse /supplier e cadastre fornecedores.
- Acesse /produto_novo e cadastre produtos vinculando aos fornecedores.
- Veja os produtos listados em /product.
- Confirme o vínculo em /product_supplier.
- Analise os dados no relatório /product_supplier_report.
- Teste exportações e gráficos.
- Explore validações, exclusões e edições.

📌 Observações Técnicas
- O banco de dados é SQLite e é recriado ao iniciar o backend com npm run dev.
- Os arquivos de log (*.log) presentes em /backend/logs podem ser excluídos do controle de versão em ambientes de produção.
- Para redefinir o banco, basta apagar database.sqlite e reiniciar o backend.

🛠️ Sistema pronto para avaliação — modular, funcional e extensível
