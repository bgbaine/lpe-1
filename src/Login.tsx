import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"
import { useFuncionarioStore } from "./context/FuncionarioContext"

type Inputs = {
    email: string
    senha: string
    manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
    const { register, handleSubmit } = useForm<Inputs>()    
    const { logaFuncionario } = useFuncionarioStore()
    const navigate = useNavigate()

    async function verificaLogin(data: Inputs) {
        const response = await 
          fetch(`${apiUrl}/funcionarios/login`, {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({ email: data.email, senha: data.senha })
          })
        
        if (response.status == 200) {
            const dados = await response.json()

            logaFuncionario(dados)
            
            if (data.manter) {
                localStorage.setItem("funcionarioKey", dados.id)

                if (sessionStorage.getItem("funcionarioKey"))
                    sessionStorage.removeItem("funcionarioKey")
            } else {
                sessionStorage.setItem("funcionarioKey", dados.id)

                if (localStorage.getItem("funcionarioKey"))
                    localStorage.removeItem("funcionarioKey")
            }

            navigate("/")
        } else {
            toast.error("Erro... Login ou senha incorretos")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                    Acesse sua conta
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Entre com suas credenciais para acessar o sistema
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-8">
                    <form className="space-y-6" onSubmit={handleSubmit(verificaLogin)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Endereço de e-mail
                            </label>
                            <input 
                                type="email" 
                                id="email"
                                className="block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-900"
                                placeholder="funcionario@empresa.com"
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

                        <div className="flex items-center justify-between">
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
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                    Esqueceu sua senha?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                </svg>
                                Entrar
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-slate-600">
                                Ainda não possui conta?{" "}
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                    Cadastre-se
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}