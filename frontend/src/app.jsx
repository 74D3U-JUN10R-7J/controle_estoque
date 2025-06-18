import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/products';
import Suppliers from './pages/suppliers';
import ProdutoFornecedor from './pages/produto_fornecedor';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      {/* Menu lateral */}
      <nav style={{ width: '200px', padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <h3>📦 Navegação</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><Link to="/products">Produtos</Link></li>
          <li><Link to="/suppliers">Fornecedores</Link></li>
          <li><Link to="/produto-fornecedor">Associações</Link></li>
        </ul>
      </nav>

      {/* Conteúdo da página */}
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/produto-fornecedor" element={<ProdutoFornecedor />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;