import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Componentes
import Navbar from './components/layout/Navbar';

// Páginas
import Home from './pages/Home';
import About from './pages/About';
import Help from './pages/Help';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './components/auth/AdminLogin';
import { FaqSearchProvider } from './context/FaqSearchContext';

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
      <FaqSearchProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<AdminLogin />} />
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
      </FaqSearchProvider>
    </BrowserRouter>
  );
}

export default App;