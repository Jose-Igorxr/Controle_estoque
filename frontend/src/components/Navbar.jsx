import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [usuarioNome, setUsuarioNome] = useState('Carregando...');
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      try {        
        const response = await axios.get('http://localhost:8000/api/usuario-logado/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        setUsuarioNome(response.data.nome); 
      } catch (error) {
        console.error("Erro ao buscar dados do usuário", error);
        setUsuarioNome("Usuário");
      }
    };

    if (token) buscarDadosUsuario();
  }, [token]);

  const fazerLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkStyle = (path) => 
    `px-4 py-2 rounded-md font-medium transition-all ${
      location.pathname === path 
      ? 'bg-blue-600 text-white shadow-md' 
      : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`;

  return (
    <nav className="bg-[#1e1e1e] border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
            <span className="text-xl">📦</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-white">Prefeitura</span>
            <span className="ml-1.5 text-blue-400 text-bg font-light tracking-tight">Estoque</span>
          </div>
        </div>
       
        <div className="flex items-center gap-2 bg-[#121212] p-1 rounded-lg border border-gray-800">
          <button onClick={() => navigate('/')} className={linkStyle('/')}>Lista de Produtos</button>
          <button onClick={() => navigate('/cadastrar')} className={linkStyle('/cadastrar')}>Novo Produto</button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Autenticado</p>
            <p className="text-sm font-semibold text-blue-400">{usuarioNome}</p>
          </div>
          <button 
            onClick={fazerLogout}
            className="bg-red-900/20 text-red-500 hover:bg-red-900/40 px-4 py-2 rounded-md border border-red-900/50 transition-all font-medium text-sm"
          >
            Sair
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;