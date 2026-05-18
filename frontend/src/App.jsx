import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListaProdutos from './components/ListaProdutos';
import ProdutoForm from './components/ProdutoFormulario.jsx';
import MovimentacaoForm from './components/MovimentacaoForm';
import Login from './components/Login';
import RelatorioMovimentacao from './components/MovimentacaoRelatorio';
import ProdutoEditarForm from './components/ProdutoEditarForm';
import Dashboard from './components/Dashboard';
import Perfil from './components/Perfil';


const MainLayout = () => {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <main className="p-4">
        <Outlet /> 
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/",
    element: <MainLayout/>, 
    children: [
      {
        index: true, 
        element: <Dashboard/>,
      },
      {
        path: "/lista",
        element: <ListaProdutos/>,
      },
      {
        path: "/cadastrar",
        element: <ProdutoForm/>,
      },
      {
        path: "/movimentacao",
        element: <MovimentacaoForm/>
      },
      {
        path: "/relatorio",
        element: <RelatorioMovimentacao/>
      },
      {
        path: "/editar/:id",
        element: <ProdutoEditarForm/>
      },
      {
        path: "/dashboard",
        element: <Dashboard/>,
      },
      {
        path: "/perfil",
        element: <Perfil/>,
      },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;