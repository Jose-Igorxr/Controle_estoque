import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Perfil() {
  
  const [username, setUsername] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8000/api/usuario-logado/', {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(res => {
      setUsername(res.data.username);
    })
    .catch(err => {
      console.error("Erro ao carregar perfil:", err);
      setErro("Não foi possível carregar seus dados.");
    });
  }, [token, navigate]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    
    if (novaSenha && novaSenha !== confirmarSenha) {
      setErro("As senhas digitadas não coincidem!");
      return;
    }

    try {
      
      const dadosParaEnviar = { username: username };
      if (novaSenha) {
        dadosParaEnviar.password = novaSenha;
      }

      
      await axios.patch('http://localhost:8000/api/usuario-logado/', dadosParaEnviar, {
        headers: { 'Authorization': `Token ${token}` }
      });

      setMensagem("Perfil atualizado com sucesso! 🚀");
      setNovaSenha(''); 
      setConfirmarSenha('');

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setErro("Não foi possível salvar as alterações. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="bg-[#1e1e24] p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <span>⚙️</span> Editar Perfil
          </h2>
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Voltar
          </button>
        </div>

        
        {mensagem && <div className="bg-green-900/50 border border-green-500 text-green-400 px-4 py-3 rounded mb-4 text-sm font-medium">{mensagem}</div>}
        {erro && <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 text-sm font-medium">{erro}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Nome de Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a35] text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <hr className="border-gray-700 my-6" />
          <p className="text-xs text-gray-500 mb-2">Preencha abaixo apenas se quiser alterar sua senha.</p>

          
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Nova Senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Deixe em branco para manter a atual"
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a35] text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full px-4 py-3 rounded-lg bg-[#2a2a35] text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg mt-6"
          >
            Salvar Alterações
          </button>

        </form>
      </div>
    </div>
  );
}

export default Perfil;