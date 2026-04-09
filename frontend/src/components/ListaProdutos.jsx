import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ListaProdutos() {
  const [produtos, setProdutos] = useState([])
  const [mostrarInativos, setMostrarInativos] = useState(false) 
  const [menuAberto, setMenuAberto] = useState(null) 
  const [termoBusca, setTermoBusca] = useState('')
  
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fazerLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  
  const carregarProdutos = () => {
    axios.get('http://localhost:8000/api/produtos/', {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => setProdutos(response.data))
    .catch(error => {
      if (error.response && error.response.status === 401) {
        fazerLogout()
      }
    })
  }

  useEffect(() => {
    if (!token) {
      navigate('/login') 
      return
    }
    carregarProdutos()
  }, [token, navigate])

  
  const alternarStatus = async (produtoId, statusAtual) => {
    try {
      await axios.patch(`http://localhost:8000/api/produtos/${produtoId}/`, 
        { ativo: !statusAtual }, 
        { headers: { 'Authorization': `Token ${token}` } }
      )
      
      
      setProdutos(produtos.map(p => p.id === produtoId ? { ...p, ativo: !statusAtual } : p))
      setMenuAberto(null) 
      
    } catch (error) {
      console.error("Erro ao alterar status:", error)
      alert("Erro ao tentar alterar o status do produto.")
    }
  }

  
  const produtosFiltrados = produtos.filter(produto => {
    
    const statusCorreto = mostrarInativos ? !produto.ativo : produto.ativo;
    
    
    const buscaMinuscula = termoBusca.toLowerCase();
    const nomeCorresponde = produto.nome.toLowerCase().includes(buscaMinuscula);
    const skuCorresponde = produto.sku.toLowerCase().includes(buscaMinuscula); 

    
    return statusCorreto && (nomeCorresponde || skuCorresponde);
  });

  return (
    <div className="min-h-screen bg-[#121212] p-6 text-gray-100">
      <div className="max-w-6xl mx-auto">     
        
       
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">📦 Visão Geral do Estoque</h1>
          
          <div className="flex gap-3 items-center">

        <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
              <input 
                type="text" 
                placeholder="Buscar por nome ou SKU..." 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#1e1e24] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
            
            
            <button 
              onClick={() => setMostrarInativos(!mostrarInativos)}
              className={`font-semibold py-2 px-4 rounded-lg transition-colors border shadow-sm ${
                mostrarInativos 
                  ? 'bg-red-900/40 text-red-400 border-red-800 hover:bg-red-900/60' 
                  : 'bg-[#1e1e24] text-gray-400 border-gray-700 hover:bg-gray-800'
              }`}
            >
              {mostrarInativos ? 'Produtos Desativados' : 'Produtos Desativados'}
            </button>
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#2a2a2a] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-center">Qtd Atual</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              
              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Nenhum produto encontrado nesta visualização.
                  </td>
                </tr>
              )}

              {produtosFiltrados.map((produto) => (
                <tr key={produto.id} className="hover:bg-[#252525] transition-colors group">
                  <td className={`px-6 py-4 font-mono text-sm ${produto.ativo ? 'text-blue-400' : 'text-gray-500'}`}>
                    {produto.sku}
                  </td>
                  <td className={`px-6 py-4 font-medium ${produto.ativo ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                    {produto.nome}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700">
                      {produto.categoria_nome}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${produto.quantidade_atual <= 0 ? 'text-red-500' : (produto.ativo ? 'text-green-500' : 'text-gray-500')}`}>
                      {produto.quantidade_atual}
                    </span>
                  </td>
                  
                  
                  <td className="px-6 py-4 text-center relative">
                    <button 
                      onClick={() => setMenuAberto(menuAberto === produto.id ? null : produto.id)}
                      className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors focus:outline-none"
                    >
                      ⋮
                    </button>

                    
                    {menuAberto === produto.id && (
                      <div className="absolute right-8 top-10 w-40 bg-[#2a2a35] border border-gray-600 rounded-lg shadow-2xl z-50 flex flex-col">
                        <button 
                          onClick={() => {
                            setMenuAberto(null)
                            navigate(`/editar/${produto.id}`)
                          }}
                          className="px-4 py-3 text-sm text-left text-gray-200 hover:bg-[#3f3f4e] transition-colors border-b border-gray-700 flex items-center gap-2"
                        >
                          ✏️ Editar
                        </button>
                        
                        <button 
                          onClick={() => alternarStatus(produto.id, produto.ativo)}
                          className={`px-4 py-3 text-sm text-left transition-colors flex items-center gap-2 ${
                            produto.ativo 
                              ? 'text-red-400 hover:bg-red-900/30' 
                              : 'text-green-400 hover:bg-green-900/30'
                          }`}
                        >
                          {produto.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default ListaProdutos