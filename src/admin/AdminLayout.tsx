import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../admin/context/AdminContext'

export default function AdminLayout() {
    const { admin, deslogaAdmin } = useAdminStore()
    const navigate = useNavigate()

    function handleLogout() {
        deslogaAdmin()
        sessionStorage.removeItem("adminKey")
        localStorage.removeItem("adminKey")
        navigate("/admin/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 bg-blue-600">
                        <span className="text-white text-xl font-bold">Admin HelpDesk</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    to="/admin" 
                                    className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
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
                                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    Tickets
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/admin/servicos" 
                                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    Serviços
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {admin.nome?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {admin.nome || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {admin.email || 'admin@helpdesk.com'}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Sair"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64">
                <Outlet />
            </div>
        </div>
    )
}