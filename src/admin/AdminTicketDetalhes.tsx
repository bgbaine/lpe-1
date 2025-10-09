import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import type { TicketType } from "../utils/TicketType"

const apiUrl = import.meta.env.VITE_API_URL

const coresPrioridade = {
    BAIXA: "bg-green-100 text-green-800 border-green-200",
    MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    ALTA: "bg-orange-100 text-orange-800 border-orange-200",
    CRITICA: "bg-red-100 text-red-800 border-red-200"
}

const coresStatus = {
    ABERTO: "bg-blue-100 text-blue-800 border-blue-200",
    EM_ATENDIMENTO: "bg-purple-100 text-purple-800 border-purple-200",
    FECHADO: "bg-gray-100 text-gray-800 border-gray-200"
}

export default function AdminTicketDetalhes() {
    const { ticketId } = useParams<{ ticketId: string }>()
    const navigate = useNavigate()
    const [ticket, setTicket] = useState<TicketType | null>(null)
    const [loading, setLoading] = useState(true)
    const [resposta, setResposta] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function buscarTicket() {
            if (!ticketId) return

            try {
                const response = await fetch(`${apiUrl}/tickets/${ticketId}`)
                if (response.ok) {
                    const dados = await response.json()
                    setTicket(dados)
                } else {
                    toast.error("Ticket não encontrado")
                    navigate("/admin/tickets")
                }
            } catch (error) {
                console.error("Erro ao buscar ticket:", error)
                toast.error("Erro ao carregar ticket")
                navigate("/admin/tickets")
            } finally {
                setLoading(false)
            }
        }

        buscarTicket()
    }, [ticketId, navigate])

    async function responderTicket() {
        if (!resposta.trim() || !ticket) {
            toast.error("Digite uma resposta válida")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`${apiUrl}/tickets/${ticket.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resposta: resposta.trim(),
                    status: "FECHADO"
                })
            })

            if (response.ok) {
                const ticketAtualizado = await response.json()
                setTicket(ticketAtualizado)
                setResposta("")
                toast.success("Resposta enviada com sucesso!")
                navigate("/admin/tickets")
            } else {
                toast.error("Erro ao enviar resposta")
            }
        } catch {
            toast.error("Erro ao enviar resposta")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!ticket) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket não encontrado</h1>
                    <Link 
                        to="/admin/tickets" 
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Voltar para lista de tickets
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                    <Link 
                        to="/admin/tickets"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Ticket #{ticket.id}
                    </h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${coresStatus[ticket.status]}`}>
                        {ticket.status === 'EM_ATENDIMENTO' ? 'Em Atendimento' : ticket.status}
                    </span>
                </div>
                <p className="text-gray-600">
                    {ticket.status === 'FECHADO' ? 'Detalhes do ticket' : 'Responder ao ticket'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Descrição do Problema */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Descrição do Problema</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.descricao}</p>
                        </div>
                    </div>

                    {/* Imagem se existir */}
                    {ticket.imagem && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagem Anexada</h2>
                            <img 
                                src={ticket.imagem} 
                                alt="Imagem do ticket" 
                                className="max-w-full h-auto rounded-lg border border-gray-200"
                            />
                        </div>
                    )}

                    {/* Resposta (se existir) */}
                    {ticket.resposta && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resposta do Administrador</h2>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{ticket.resposta}</p>
                                {ticket.data_fechamento && (
                                    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-blue-200">
                                        Respondido em: {new Date(ticket.data_fechamento).toLocaleDateString("pt-br")} às {new Date(ticket.data_fechamento).toLocaleTimeString("pt-br")}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Campo de resposta (apenas para tickets em atendimento) */}
                    {ticket.status === 'EM_ATENDIMENTO' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sua Resposta</h2>
                            <div className="space-y-4">
                                <textarea
                                    value={resposta}
                                    onChange={(e) => setResposta(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={6}
                                    placeholder="Digite sua resposta para resolver este ticket..."
                                />
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        to="/admin/tickets"
                                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        onClick={responderTicket}
                                        disabled={isSubmitting || !resposta.trim()}
                                        className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors flex items-center space-x-2"
                                    >
                                        {isSubmitting && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        <span>{isSubmitting ? 'Enviando...' : 'Responder e Fechar Ticket'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar com Informações */}
                <div className="space-y-6">
                    {/* Informações do Ticket */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações</h2>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Prioridade</span>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium border ${coresPrioridade[ticket.prioridade]}`}>
                                        {ticket.prioridade}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <span className="text-sm font-medium text-gray-500">Data de Abertura</span>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(ticket.data_abertura).toLocaleDateString("pt-br")} às {new Date(ticket.data_abertura).toLocaleTimeString("pt-br")}
                                </p>
                            </div>

                            {ticket.data_fechamento && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Data de Fechamento</span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(ticket.data_fechamento).toLocaleDateString("pt-br")} às {new Date(ticket.data_fechamento).toLocaleTimeString("pt-br")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informações do Serviço */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Serviço</h2>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Nome</span>
                                <p className="mt-1 text-sm text-gray-900 font-medium">{ticket.servico.nome}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Time</span>
                                <p className="mt-1 text-sm text-gray-900">{ticket.servico.time.nome}</p>
                            </div>
                            {ticket.servico.descricao && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Descrição</span>
                                    <p className="mt-1 text-sm text-gray-700">{ticket.servico.descricao}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informações do Funcionário */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Funcionário</h2>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Nome</span>
                                <p className="mt-1 text-sm text-gray-900 font-medium">{ticket.funcionario.nome}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500">Email</span>
                                <p className="mt-1 text-sm text-gray-900">{ticket.funcionario.email}</p>
                            </div>
                            {ticket.funcionario.cargo && (
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Cargo</span>
                                    <p className="mt-1 text-sm text-gray-900">{ticket.funcionario.cargo}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}