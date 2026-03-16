import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  // O React já tenta buscar o token salvo no navegador quando a página abre
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erroLogin, setErroLogin] = useState('')

  // --- ESTADOS DE DADOS ---
  const [produtos, setProdutos] = useState([])

  // --- FUNÇÃO DE LOGIN ---
  const fazerLogin = async (e) => {
    e.preventDefault() // Evita que a página recarregue ao enviar o formulário
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username: username,
        password: password
      })
      
      const chaveGerada = response.data.token
      setToken(chaveGerada) // Guarda no React
      localStorage.setItem('token', chaveGerada) // Guarda no Navegador
      setErroLogin('') // Limpa erros antigos
      
    } catch (error) {
      setErroLogin('Usuário ou senha incorretos! ❌')
      console.error(error)
    }
  }

  const fazerLogout = () => {
    setToken('')
    localStorage.removeItem('token')
    setProdutos([]) 
  }

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/api/produtos/', {
        headers: {
          'Authorization': `Token ${token}` 
        }
      })
      .then(response => {
        setProdutos(response.data)
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error)
        if (error.response && error.response.status === 401) {
          fazerLogout()
        }
      })
    }
  }, [token]) 

  if (!token) {
    return (
      <div style={{ padding: '50px', fontFamily: 'sans-serif', maxWidth: '300px', margin: '0 auto' }}>
        <h2>🔒 Acesso Restrito</h2>
        
        <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Usuário" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
            style={{ padding: '8px' }}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
            Entrar
          </button>
        </form>

        {erroLogin && <p style={{ color: 'red', fontWeight: 'bold' }}>{erroLogin}</p>}
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif',}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📦 Controle de Estoque</h1>
        <button onClick={fazerLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair (Logout)
        </button>
      </div>
      
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th>SKU</th>
            <th>Nome do Produto</th>
            <th>Categoria</th>
            <th>Quantidade Atual</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.id}>
              <td>{produto.sku}</td>
              <td>{produto.nome}</td>
              <td>{produto.categoria_detalhe ? produto.categoria_detalhe.nome : 'Sem categoria'}</td>
              <td>
                <strong style={{ color: produto.quantidade_atual < produto.estoque_minimo ? 'red' : 'green' }}>
                  {produto.quantidade_atual}
                </strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App