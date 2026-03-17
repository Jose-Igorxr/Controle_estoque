import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProdutoForm = () => {
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState(''); 
  const [categorias, setCategorias] = useState([]); 
  const [sku, setSku] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Busca as categorias cadastradas assim que a tela abre
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categorias/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };
    fetchCategorias();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/produtos/', 
        { nome, categoria: categoriaId, sku, descricao }, 
        { headers: { 'Authorization': `Token ${token}` } }
      );
      alert("Sucesso!");
      navigate('/');
    } catch (error) {
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Novo Produto</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        
        {/* Dropdown com os nomes das categorias */}
        <select 
          value={categoriaId} 
          onChange={(e) => setCategoriaId(e.target.value)} 
          required
          style={{ padding: '8px' }}
        >
          <option value="">Selecione uma Categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>

        <input type="text" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
        <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default ProdutoForm;