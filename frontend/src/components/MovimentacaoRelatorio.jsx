import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function RelatorioMovimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  
  const [filtroTipo, setFiltroTipo] = useState('TODAS'); 
  const [termoBusca, setTermoBusca] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8000/api/movimentacoes/', {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      const dadosOrdenados = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
      setMovimentacoes(dadosOrdenados);
    })
    .catch(error => {
      console.error("Erro ao buscar histórico:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });
  }, [token, navigate]);

  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const passouNoTipo = filtroTipo === 'TODAS' || mov.tipo === filtroTipo;

    const busca = termoBusca.toLowerCase();
    const nomeCorresponde = (mov.produto_nome || '').toLowerCase().includes(busca);
    const destinoOrigemCorresponde = (mov.destino_origem || '').toLowerCase().includes(busca);
    const passouNaBusca = nomeCorresponde || destinoOrigemCorresponde;

    return passouNoTipo && passouNaBusca;
  });

  const gerarPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.text("Relatório de Movimentações - Estoque", 14, 15);

    const colunas = ["Data", "Tipo", "Motivo", "Produto", "Qtd", "Origem/Destino", "Usuário"];

    const linhas = movimentacoesFiltradas.map(mov => [
      new Date(mov.data).toLocaleDateString('pt-BR'),
      mov.tipo?.toUpperCase() === 'ENTRADA' ? 'ENTRADA' : 'SAÍDA',
      mov.motivo ? mov.motivo.replace('_', ' ') : '-', 
      mov.produto_nome,
      mov.quantidade,
      mov.destino_origem || '-',
      mov.usuario_nome
    ]);

    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 9,       
        cellPadding: 3,     
        overflow: 'linebreak' 
      },
      headStyles: {
        fillColor: [41, 128, 185], 
        textColor: 255,
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center' }, 
        1: { halign: 'center' }, 
        2: { halign: 'center' }, 
        3: { halign: 'center' }, 
        4: { halign: 'center' }, 
        5: { halign: 'center' }, 
        6: { halign: 'center' },      
      }
    });

    doc.save("relatorio_estoque.pdf");
  };

  return (
    <div className="min-h-screen bg-[#121212] p-6 text-gray-100">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">📜 Histórico de Movimentações</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
          >
            Voltar para Estoque
          </button>
        </div>

       
        <div className="bg-[#1e1e24] p-4 rounded-lg border border-gray-700 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
          
          <div className="relative w-full md:w-1/2">
            <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por produto, origem ou destino..." 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-gray-400 font-semibold text-sm">Filtrar por:</label>
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="TODAS">🔄 Todas as Movimentações</option>
              <option value="ENTRADA">🟢 Apenas Entradas</option>
              <option value="SAIDA">🔴 Apenas Saídas</option>
            </select>
          </div>
          <button 
            onClick={gerarPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md w-full md:w-auto justify-center"
          >
            <span>📄</span> Exportar PDF
          </button>

        </div>

        
        <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 shadow-2xl pb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#2a2a2a] text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Data e Hora</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Motivo</th> 
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4 text-center">Quantidade</th>
                  <th className="px-6 py-4">Origem / Destino</th>
                  <th className="px-6 py-4">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                
                {movimentacoesFiltradas.length === 0 && (
                  <tr>
                    
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Nenhuma movimentação encontrada com estes filtros.
                    </td>
                  </tr>
                )}

                {movimentacoesFiltradas.map((mov) => (
                  <tr key={mov.id} className="hover:bg-[#252525] transition-colors">
                    
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(mov.data).toLocaleString('pt-BR')}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        mov.tipo?.toUpperCase() === 'ENTRADA' 
                          ? 'bg-green-900/30 text-green-400 border-green-800' 
                          : 'bg-red-900/30 text-red-400 border-red-800'
                      }`}>
                        {mov.tipo?.toUpperCase() === 'ENTRADA' ? 'ENTRADA' : 'SAÍDA'}
                      </span>
                    </td>
                    
                    
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">
                      <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                        {mov.motivo ? mov.motivo.replace('_', ' ') : '-'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-200">
                      {mov.produto_nome}
                    </td>
                    
                    <td className={`px-6 py-4 text-center font-bold ${
                      mov.tipo?.toUpperCase() === 'ENTRADA' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {mov.tipo?.toUpperCase() === 'ENTRADA' ? '+' : '-'}{mov.quantidade}
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-[200px] truncate" title={mov.destino_origem}>
                      {mov.destino_origem || '-'}
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-400">
                      👤 {mov.usuario_nome}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RelatorioMovimentacao;