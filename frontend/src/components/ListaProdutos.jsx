import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function ListaProdutos() {
  const [produtos, setProdutos] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fazerLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    if (!token) {
      navigate('/login') 
      return
    }

    axios.get('http://localhost:8000/api/produtos/', {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => setProdutos(response.data))
    .catch(error => {
      if (error.response && error.response.status === 401) {
        fazerLogout()
      }
    })
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-[#121212] p-6 text-gray-100">
  <div className="max-w-5xl mx-auto">    
    <div className="bg-[#1e1e1e] rounded-lg border border-gray-800 shadow-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#2a2a2a] text-gray-400 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">SKU</th>
            <th className="px-6 py-4">Nome</th>
            <th className="px-6 py-4">Categoria</th>
            <th className="px-6 py-4 text-center">Qtd Atual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {produtos.map((produto) => (
            <tr key={produto.id} className="hover:bg-[#252525] transition-colors group">
              <td className="px-6 py-4 font-mono text-sm text-blue-400">{produto.sku}</td>
              <td className="px-6 py-4 font-medium text-gray-200">{produto.nome}</td>
              <td className="px-6 py-4">
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700">
                  {produto.categoria_nome}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`text-sm font-bold ${produto.quantidade <= 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {produto.quantidade}
                </span>
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