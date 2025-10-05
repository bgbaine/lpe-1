import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MeusChamados from './MeusChamados.tsx'
import Servico from './Servico.tsx'

// Importar componentes administrativos
import AdminLayout from './admin/AdminLayout.tsx'
import AdminLogin from './admin/AdminLogin.tsx'
import AdminDashboard from './admin/AdminDashboard.tsx'
import AdminTickets from './admin/AdminTickets.tsx'
import AdminServicos from './admin/AdminServicos.tsx'
import AdminNovoServico from './admin/AdminNovoServico.tsx'
import AdminCadAdmin from './admin/AdminCadAdmin.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// ✅ Google Fonts Import - Add this
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
document.head.appendChild(link)

const rotas = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "tickets", element: <AdminTickets /> },
      { path: "servicos", element: <AdminServicos /> },
      { path: "novo-servico", element: <AdminNovoServico /> },
      { path: "admins", element: <AdminCadAdmin /> },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'detalhes/:ticketId', element: <Detalhes /> },
      { path: 'meus-chamados', element: <MeusChamados /> },
      { path: 'servico/:servicoId', element: <Servico /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)