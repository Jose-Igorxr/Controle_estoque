import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MovimentacaoForm = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState('ENTRADA'); 
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const [destinoOrigem, setDestinoOrigem] = useState('');
  const [motivo, setMotivo] = useState(''); 

  const motivosEntrada = [
    { value: 'Compra', label: 'Compra de Fornecedor' },
    { value: 'Devolucao', label: 'Devolução de Cliente' },
    { value: 'Ajuste_Positivo', label: 'Ajuste de Inventário (+)' }
  ];

  const motivosSaida = [
    { value: 'Venda', label: 'Venda / Expedição' },
    { value: 'Avaria', label: 'Perda / Avaria' },
    { value: 'Consumo', label: 'Consumo Interno' },
    { value: 'Ajuste_Negativo', label: 'Ajuste de Inventário (-)' }
  ];

  
  const opcoesMotivo = tipo === 'ENTRADA' ? motivosEntrada : motivosSaida;
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('https://api-controle-estoque-hyam.onrender.com/api/produtos/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      }
    };
    fetchProdutos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); 

    try {
      await axios.post('https://api-controle-estoque-hyam.onrender.com/api/movimentacoes/', 
        { 
          produto: produtoId, 
          tipo: tipo, 
          quantidade: quantidade, 
          destino_origem: destinoOrigem,
          motivo: motivo 
        }, 
        { headers: { 'Authorization': `Token ${token}` } }
      );
      
      alert("Movimentação registrada com sucesso!");
      navigate('/'); 
      
    } catch (error) {
      console.error("Motivo da recusa do Django:", error.response?.data); 
      setErro("Erro ao registrar movimentação. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 mt-10">
      
      
      <div className="w-full max-w-md bg-[#1e1e24] rounded-xl border border-gray-700 p-8 shadow-2xl">
        
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          🔄 Movimentar Estoque
        </h2>

        {erro && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg">
            <p className="text-red-400 text-sm font-semibold text-center">{erro}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
         
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Selecione o Produto</label>
            <select 
              value={produtoId} 
              onChange={(e) => setProdutoId(e.target.value)} 
              required
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="" disabled className="text-gray-500">Escolha um item...</option>
              {produtos.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nome} (Estoque: {prod.quantidade_atual})
                </option>
              ))}
            </select>
          </div>

         
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Tipo de Movimentação</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 font-medium">
                <input 
                  type="radio" 
                  value="ENTRADA" 
                  checked={tipo === 'ENTRADA'} 
                  onChange={(e) => {
                    setTipo(e.target.value);
                    setMotivo(''); 
                  }}
                  className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
                />
                <span className="text-green-400">➕ Entrada</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 font-medium">
                <input 
                  type="radio" 
                  value="SAIDA" 
                  checked={tipo === 'SAIDA'} 
                  onChange={(e) => {
                    setTipo(e.target.value);
                    setMotivo(''); 
                  }}
                  className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
                />
                <span className="text-red-400">➖ Saída</span>
              </label>
            </div>
          </div>

         
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Motivo da Movimentação</label>
            <select 
              value={motivo} 
              onChange={(e) => setMotivo(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="" disabled className="text-gray-500">Selecione um motivo...</option>
              {opcoesMotivo.map(opcao => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Quantidade</label>
            <input 
              type="number" 
              min="1"
              placeholder="Ex: 10" 
              value={quantidade} 
              onChange={(e) => setQuantidade(e.target.value)} 
              required 
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Destino ou Origem</label>
            <input 
              type="text" 
              placeholder="Ex: Nota Fiscal 123, Galpão 2" 
              value={destinoOrigem} 
              onChange={(e) => setDestinoOrigem(e.target.value)} 
              required 
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
          </div>

         
          <div className="flex gap-3 mt-4">
            <button 
              type="button"
              onClick={() => navigate('/relatorio')}
              className="w-1/3 bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="w-2/3 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Confirmar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MovimentacaoForm;