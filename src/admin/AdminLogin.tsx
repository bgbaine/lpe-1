import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAdminStore } from "../admin/context/AdminContext"

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminLogin() {
    const { register, handleSubmit } = useForm<Inputs>()    
    const { logaAdmin } = useAdminStore()
    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        try {
            const response = await fetch(`${apiUrl}/admins/login`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({ email: data.email, senha: data.senha })
            })
            
            if (response.status == 200) {
                const dados = await response.json()
                logaAdmin(dados)
                
                if (data.manter) {
                    localStorage.setItem("adminKey", dados.id)
                    sessionStorage.removeItem("adminKey")
                } else {
                    sessionStorage.setItem("adminKey", dados.id)
                    localStorage.removeItem("adminKey")
                }

                navigate("/admin")
            } else {
                toast.error("Erro... Login ou senha incorretos")
            }
        } catch {
            toast.error("Erro ao fazer login")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                    Área Administrativa
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Acesso restrito aos administradores do sistema
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-8">
                    <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                E-mail administrativo
                            </label>
                            <input 
                                type="email" 
                                id="email"
                                className="block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-900"
                                placeholder="admin@empresa.com"
                                required 
                                {...register("email")} 
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Senha
                            </label>
                            <input 
                                type="password" 
                                id="password"
                                className="block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-900"
                                placeholder="••••••••"
                                required 
                                {...register("senha")} 
                            />
                        </div>

                        <div className="flex items-center">
                            <input 
                                id="remember" 
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-colors duration-200"
                                {...register("manter")} 
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
                                Manter conectado
                            </label>
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                                Acessar Painel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}