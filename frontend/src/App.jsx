import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListaProdutos from './components/ListaProdutos';
import ProdutoForm from './components/ProdutoForm';
import Login from './components/Login';

// Componente de Layout que inclui a Navbar
const MainLayout = () => {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <main className="p-4">
        <Outlet /> {/* Aqui é onde o conteúdo da página vai carregar */}
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />, // Protege todas as rotas filhas
    children: [
      {
        path: "/",
        element: <ListaProdutos />,
      },
      {
        path: "/cadastrar",
        element: <ProdutoForm />,
      },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;