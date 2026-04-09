import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    
    const carregarDados = async () => {
      try {
        const [resProdutos, resMovimentacoes] = await Promise.all([
          axios.get('http://localhost:8000/api/produtos/', { headers: { 'Authorization': `Token ${token}` } }),
          axios.get('http://localhost:8000/api/movimentacoes/', { headers: { 'Authorization': `Token ${token}` } })
        ]);

        setProdutos(resProdutos.data);
        setMovimentacoes(resMovimentacoes.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [token, navigate]);

  if (carregando) {
    return <div className="min-h-screen bg-[#121212] text-white flex justify-center items-center">Carregando painel...</div>;
  }

  
  const produtosAtivos = produtos.filter(p => p.ativo);
  
  
  const estoqueCritico = produtosAtivos.filter(p => p.quantidade_atual <= 5);
  
  
  const estoqueZerado = produtosAtivos.filter(p => p.quantidade_atual === 0);

  
  const ultimasMovimentacoes = [...movimentacoes]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#121212] p-6 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <h1 className="text-3xl font-bold text-gray-100 mb-8">📊 Painel de Controle</h1>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          
          <div className="bg-[#1e1e24] p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Produtos Ativos</p>
              <h2 className="text-4xl font-bold text-blue-400 mt-2">{produtosAtivos.length}</h2>
            </div>
            <div className="text-4xl">📦</div>
          </div>

          
          <div className="bg-[#1e1e24] p-6 rounded-xl border border-orange-900/50 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider">Estoque Baixo (≤ 5)</p>
              <h2 className="text-4xl font-bold text-orange-500 mt-2">{estoqueCritico.length}</h2>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>

          
          <div className="bg-[#1e1e24] p-6 rounded-xl border border-red-900/50 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-semibold uppercase tracking-wider">Estoque Zerado</p>
              <h2 className="text-4xl font-bold text-red-500 mt-2">{estoqueZerado.length}</h2>
            </div>
            <div className="text-4xl">🚨</div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          
          
          <div className="bg-[#1e1e24] rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col">
            <div className="bg-red-900/20 px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                <span>🔥</span> Produtos Precisando de Reposição
              </h3>
            </div>
            <div className="p-4 flex-1">
              {estoqueCritico.length === 0 ? (
                <p className="text-gray-500 text-center mt-4">Nenhum produto em nível crítico. Estoque saudável! ✅</p>
              ) : (
                <ul className="divide-y divide-gray-800">
                  {estoqueCritico.map(p => (
                    <li key={p.id} className="py-3 flex justify-between items-center">
                      <span className="font-medium text-gray-300">{p.nome}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.quantidade_atual === 0 ? 'bg-red-900/50 text-red-400' : 'bg-orange-900/50 text-orange-400'
                      }`}>
                        {p.quantidade_atual} un
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

      
          <div className="bg-[#1e1e24] rounded-xl border border-gray-700 shadow-lg overflow-hidden flex flex-col">
            <div className="bg-[#2a2a35] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                <span>⏱️</span> Últimas Movimentações
              </h3>
              <button onClick={() => navigate('/relatorio')} className="text-blue-400 text-sm hover:underline">Ver todas</button>
            </div>
            <div className="p-4 flex-1">
              <ul className="divide-y divide-gray-800">
                {ultimasMovimentacoes.map(mov => (
                  <li key={mov.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-300 text-sm">{mov.produto_nome}</p>
                      <p className="text-xs text-gray-500">{new Date(mov.data).toLocaleDateString('pt-BR')} - {mov.usuario_nome}</p>
                    </div>
                    <span className={`font-bold text-sm ${mov.tipo === 'Entrada' ? 'text-green-500' : 'text-red-500'}`}>
                      {mov.tipo === 'Entrada' ? '+' : '-'}{mov.quantidade}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;