import { Link } from "react-router-dom"
import { useFuncionarioStore } from "../context/FuncionarioContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Titulo() {
    const { funcionario, deslogaFuncionario } = useFuncionarioStore()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function funcionarioSair() {
        if (confirm("Deseja sair realmente?")) {
            deslogaFuncionario()
            if (localStorage.getItem("funcionarioKey")) {
                localStorage.removeItem("funcionarioKey")
            }
            if (sessionStorage.getItem("funcionarioKey")) {
                sessionStorage.removeItem("funcionarioKey")
            }
            navigate("/login")
        }
    }

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-semibold text-slate-900 tracking-tight">
                                HelpDesk
                            </span>
                            <span className="text-xs text-blue-600 font-medium">
                                Avenue
                            </span>
                        </div>
                    </Link>
                    
                    <button 
                        type="button" 
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" 
                        aria-controls="navbar-menu" 
                        aria-expanded={isMenuOpen}
                        onClick={toggleMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    <div className={`${isMenuOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-white border-t border-slate-200 shadow-lg md:relative md:top-0 md:border-0 md:shadow-none md:block md:w-auto`} id="navbar-menu">
                        <div className="px-4 py-4 md:p-0">
                            {funcionario.id ? (
                                <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-50 border-2 border-blue-200 rounded-full flex items-center justify-center">
                                            <span className="text-blue-700 font-semibold text-sm">
                                                {funcionario.nome?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-slate-700 font-medium">
                                            {funcionario.nome}
                                        </span>
                                    </div>
                                    
                                    <Link 
                                        to="/meus-chamados" 
                                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                        Meus Chamados
                                    </Link>
                                    
                                    <button
                                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-slate-300 transition-all duration-200"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            funcionarioSair();
                                        }}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                        </svg>
                                        Sair
                                    </button>
                                </div>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                    </svg>
                                    Entrar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}