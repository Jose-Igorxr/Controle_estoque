import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProdutoEditarForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState(''); 
  const [categorias, setCategorias] = useState([]); 
  const [sku, setSku] = useState('');
  const [descricao, setDescricao] = useState('');

 
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('[https://api-controle-estoque-hyam.onrender.com](https://api-controle-estoque-hyam.onrender.com)/api/categorias/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };
    fetchCategorias();
  }, [token]);

  
  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.get(`[https://api-controle-estoque-hyam.onrender.com](https://api-controle-estoque-hyam.onrender.com)/api/produtos/${id}/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        const produto = response.data;
        
        setNome(produto.nome);
        setCategoriaId(produto.categoria);
        setSku(produto.sku);
        setDescricao(produto.descricao || ''); 
      } catch (error) {
        console.error("Erro ao buscar produto", error);
        alert("Produto não encontrado!");
        navigate('/');
      }
    };
    if (id) {
      fetchProduto();
    }
  }, [id, token, navigate]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`[https://api-controle-estoque-hyam.onrender.com](https://api-controle-estoque-hyam.onrender.com)/api/produtos/${id}/`, 
        { nome, categoria: categoriaId, sku, descricao }, 
        { headers: { 'Authorization': `Token ${token}` } }
      );
      alert("Produto atualizado com sucesso!");
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao atualizar", error);
      alert("Erro ao atualizar o produto.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 mt-10">
      
      
      <div className="w-full max-w-md bg-[#1e1e24] rounded-xl border border-gray-700 p-8 shadow-2xl">
        
        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          ✏️ Editar Produto
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Nome do Produto</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Categoria</label>
            <select 
              value={categoriaId} 
              onChange={(e) => setCategoriaId(e.target.value)} 
              required
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="" disabled className="text-gray-500">Selecione uma Categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Código SKU</label>
            <input 
              type="text" 
              value={sku} 
              onChange={(e) => setSku(e.target.value)} 
              required 
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Descrição</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              rows="3"
              className="w-full px-4 py-2 bg-[#2a2a35] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-1/3 bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="w-2/3 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Salvar Alterações
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProdutoEditarForm;