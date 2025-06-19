import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Product from './pages/product';
import Supplier from './pages/supplier';
import ProductSupplier from './pages/product_supplier';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        {/* Menu lateral */}
        <nav style={{ width: '200px', padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <h3>📦 Navegação</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><Link to="/product">Produtos</Link></li>
            <li><Link to="/supplier">Fornecedores</Link></li>
            <li><Link to="/product_supplier">Associações</Link></li>
          </ul>
        </nav>

        {/* Conteúdo da página */}
        <main style={{ flexGrow: 1, padding: '1rem' }}>
          <Routes>
            <Route path="/product" element={<Product />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/product_supplier" element={<ProductSupplier />} />
            <Route path="*" element={<p>404 - Página não encontrada 😢</p>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
