import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Componentes
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas
import Mapa from './pages/Mapa';
import About from './pages/About';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Estilos
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import './App.css';

function App() {
  // Inicializar tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/mapa" />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer 
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;