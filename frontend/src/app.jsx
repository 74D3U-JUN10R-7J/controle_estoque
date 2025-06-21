import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Product from './pages/product';
import Supplier from './pages/supplier';
import ProductSupplier from './pages/product_supplier';
import ProductSupplierReport from './pages/product_supplier_report';
import FornecedorForm from './pages/FornecedorForm';
import ProductForm from './pages/ProductForm';
import PaginaInicial from './pages/pagina-inicial'; // ✅ Importação da página inicial

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        {/* Menu lateral */}
        <nav style={{ width: '200px', padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <h3>📦 Navegação</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><Link to="/">Início</Link></li> {/* ✅ Link para a página inicial */}
            <li><Link to="/product">Produtos</Link></li>
            <li><Link to="/produto_novo">+ Novo Produto</Link></li>
            <li><Link to="/supplier">Fornecedores</Link></li>
            <li><Link to="/fornecedor_novo">+ Novo Fornecedor</Link></li>
            <li><Link to="/product_supplier">Associações</Link></li>
            <li><Link to="/product_supplier_report">Relatório Dinâmico</Link></li>
          </ul>
        </nav>

        {/* Conteúdo da página */}
        <main style={{ flexGrow: 1, padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<PaginaInicial />} /> {/* ✅ Rota para a página inicial */}
            <Route path="/product" element={<Product />} />
            <Route path="/produto_novo" element={<ProductForm />} />
            <Route path="/produto_editar/:id" element={<ProductForm />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/fornecedor_novo" element={<FornecedorForm />} />
            <Route path="/product_supplier" element={<ProductSupplier />} />
            <Route path="/product_supplier_report" element={<ProductSupplierReport />} />
            <Route path="*" element={<p>404 - Página não encontrada 😢</p>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;