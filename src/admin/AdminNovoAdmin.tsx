import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import type { TimeType } from "../utils/TimeType"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminNovoAdmin() {
    const navigate = useNavigate()
    const [times, setTimes] = useState<TimeType[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        timeId: ""
    })

    useEffect(() => {
        async function getTimes() {
            try {
                const response = await fetch(`${apiUrl}/times`)
                if (response.ok) {
                    const dados = await response.json()
                    setTimes(dados)
                }
            } catch (error) {
                console.error("Erro ao carregar times:", error)
                toast.error("Erro ao carregar times")
            }
        }
        getTimes()
    }, [])

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        
        // Validações
        if (!formData.nome.trim()) {
            toast.error("Nome é obrigatório")
            return
        }
        
        if (!formData.email.trim()) {
            toast.error("Email é obrigatório")
            return
        }
        
        if (!formData.senha.trim()) {
            toast.error("Senha é obrigatória")
            return
        }
        
        if (formData.senha !== formData.confirmarSenha) {
            toast.error("Senhas não coincidem")
            return
        }
        
        if (formData.senha.length < 6) {
            toast.error("Senha deve ter pelo menos 6 caracteres")
            return
        }
        
        if (!formData.timeId) {
            toast.error("Selecione um time")
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${apiUrl}/admins`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: formData.nome.trim(),
                    email: formData.email.trim(),
                    senha: formData.senha,
                    timeId: parseInt(formData.timeId)
                })
            })

            if (response.ok) {
                toast.success("Administrador criado com sucesso!")
                navigate("/admin/administradores")
            } else {
                const error = await response.json()
                toast.error(error.message || "Erro ao criar administrador")
            }
        } catch (error) {
            console.error("Erro ao criar administrador:", error)
            toast.error("Erro ao criar administrador")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                    <Link 
                        to="/admin/administradores"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Novo Administrador</h1>
                </div>
                <p className="text-gray-600">Adicione um novo administrador ao sistema</p>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome */}
                            <div className="md:col-span-2">
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Digite o nome completo"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Digite o email"
                                    required
                                />
                            </div>

                            {/* Time */}
                            <div className="md:col-span-2">
                                <label htmlFor="timeId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Time *
                                </label>
                                <select
                                    id="timeId"
                                    name="timeId"
                                    value={formData.timeId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Selecione um time</option>
                                    {times.map(time => (
                                        <option key={time.id} value={time.id}>
                                            {time.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Senha */}
                            <div>
                                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                                    Senha *
                                </label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Digite a senha"
                                    minLength={6}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Senha *
                                </label>
                                <input
                                    type="password"
                                    id="confirmarSenha"
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Confirme a senha"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-8">
                            <Link
                                to="/admin/administradores"
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors flex items-center space-x-2"
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                <span>{loading ? "Salvando..." : "Salvar"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}