import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAdminStore } from '../admin/context/AdminContext'
import { useEffect } from 'react'

export default function AdminLayout() {
    const { admin, deslogaAdmin } = useAdminStore()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Verifica se o admin está logado ao acessar rotas administrativas
        if (!admin.id && location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
            navigate('/admin/login')
        }
    }, [admin.id, location.pathname, navigate])

    function handleLogout() {
        deslogaAdmin()
        sessionStorage.removeItem("adminKey")
        localStorage.removeItem("adminKey")
        navigate("/admin/login")
    }

    // Se não é admin e não está na página de login, não renderiza o layout
    if (!admin.id && location.pathname !== '/admin/login') {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <span className="text-white text-lg font-bold">Admin HelpDesk</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-1">
                            <li>
                                <Link 
                                    to="/admin" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        location.pathname === '/admin' 
                                            ? 'text-blue-700 bg-blue-50 border border-blue-200' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                    </svg>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/admin/tickets" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        location.pathname === '/admin/tickets' 
                                            ? 'text-blue-700 bg-blue-50 border border-blue-200' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    Tickets
                                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {admin.ticketsCount || 0}
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/admin/servicos" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        location.pathname === '/admin/servicos' 
                                            ? 'text-blue-700 bg-blue-50 border border-blue-200' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    Serviços
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/admin/admins" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                                        location.pathname === '/admin/admins' 
                                            ? 'text-blue-700 bg-blue-50 border border-blue-200' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    Administradores
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                {admin.nome?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {admin.nome || 'Administrador'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {admin.email || 'admin@helpdesk.com'}
                                </p>
                            </div>
                            <div className="relative group">
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    title="Sair"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                    </svg>
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    Sair
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 min-h-screen">
                <div className="bg-white border-b border-gray-200">
                    <div className="px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {getPageTitle(location.pathname)}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {getPageDescription(location.pathname)}
                        </p>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

// Função auxiliar para obter o título da página baseado na rota
function getPageTitle(pathname: string): string {
    const titles: { [key: string]: string } = {
        '/admin': 'Dashboard',
        '/admin/tickets': 'Gerenciamento de Tickets',
        '/admin/servicos': 'Gerenciamento de Serviços',
        '/admin/novo-servico': 'Cadastrar Novo Serviço',
        '/admin/admins': 'Administradores do Sistema'
    }
    return titles[pathname] || 'Painel Administrativo'
}

// Função auxiliar para obter a descrição da página baseado na rota
function getPageDescription(pathname: string): string {
    const descriptions: { [key: string]: string } = {
        '/admin': 'Visão geral do sistema HelpDesk',
        '/admin/tickets': 'Visualize e gerencie todos os tickets do sistema',
        '/admin/servicos': 'Gerencie os serviços disponíveis no sistema',
        '/admin/novo-servico': 'Adicione um novo serviço ao sistema HelpDesk',
        '/admin/admins': 'Gerencie os administradores do sistema'
    }
    return descriptions[pathname] || 'Painel de controle administrativo'
}