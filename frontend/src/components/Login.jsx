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
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password
      })
      
      const token = response.data.token
      localStorage.setItem('token', token)
      setErroLogin('')
      navigate('/') // Após o login, vai para a Home (Lista)
      
    } catch (error) {
      setErroLogin('Usuário ou senha incorretos! ❌')
    }
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '300px', margin: '0 auto' }}>
      <h2>🔒 Login - Controle de Estoque</h2>
      <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '8px' }} />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>Entrar</button>
      </form>
      {erroLogin && <p style={{ color: 'red', fontWeight: 'bold' }}>{erroLogin}</p>}
    </div>
  )
}

export default Login