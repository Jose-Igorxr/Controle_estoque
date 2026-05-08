import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const navigate = useNavigate()

  const fazerLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('[https://api-controle-estoque-hyam.onrender.com](https://api-controle-estoque-hyam.onrender.com)/api/login/', {
        username,
        password
      })
      
      const token = response.data.token
      localStorage.setItem('token', token)
      setErroLogin('')
      navigate('/') 
      
    } catch (error) {
      setErroLogin('Usuário ou senha incorretos! ❌')
    }
  }

  return (
    
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#000000]">
      
      
      <div className="w-full max-w-sm bg-[#1e1e24] rounded-xl border border-gray-700 p-8 shadow-2xl">
        
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 p-4 rounded-full mb-4 border border-blue-500/30">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 text-center">
            Acesso Restrito
          </h2>
          <p className="text-sm font-medium text-blue-400 mt-1 uppercase tracking-widest">
            Estoque
          </p>
        </div>

        <form onSubmit={fazerLogin} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Usuário</label>
            <input 
              type="text" 
              placeholder="Digite seu usuário" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>

          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg mt-4"
          >
            Entrar no Sistema
          </button>
        </form>

        
        {erroLogin && (
          <div className="mt-6 p-3 bg-red-900/30 border border-red-800/50 rounded-lg animate-pulse">
            <p className="text-red-400 text-sm font-semibold text-center">
              {erroLogin}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Login