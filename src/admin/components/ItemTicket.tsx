import type { TicketType } from "../utils/TicketType"
import { toast } from "sonner"

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

type ItemTicketProps = {
    ticket: TicketType
    tickets: TicketType[]
    setTickets: React.Dispatch<React.SetStateAction<TicketType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemTicket({ ticket, tickets, setTickets }: ItemTicketProps) {
    
    async function atualizarStatus(novoStatus: 'ABERTO' | 'EM_ATENDIMENTO' | 'FECHADO') {
        try {
            const response = await fetch(`${apiUrl}/tickets/${ticket.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: novoStatus
                })
            })

            if (response.ok) {
                const ticketAtualizado = await response.json()
                const ticketsAtualizados = tickets.map(t => 
                    t.id === ticket.id ? ticketAtualizado : t
                )
                setTickets(ticketsAtualizados)
                toast.success(`Ticket ${novoStatus.replace('_', ' ').toLowerCase()} com sucesso!`)
            } else {
                toast.error("Erro ao atualizar ticket")
            }
        } catch (error) {
            toast.error("Erro ao atualizar ticket")
        }
    }

    async function responderTicket() {
        const resposta = prompt("Digite a resposta para o ticket:")
        if (resposta && resposta.trim()) {
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
                    const ticketsAtualizados = tickets.map(t => 
                        t.id === ticket.id ? ticketAtualizado : t
                    )
                    setTickets(ticketsAtualizados)
                    toast.success("Resposta enviada com sucesso!")
                } else {
                    toast.error("Erro ao enviar resposta")
                }
            } catch (error) {
                toast.error("Erro ao enviar resposta")
            }
        }
    }

    const dataAbertura = new Date(ticket.data_abertura).toLocaleDateString("pt-br")
    const dataFechamento = ticket.data_fechamento 
        ? new Date(ticket.data_fechamento).toLocaleDateString("pt-br")
        : null

    return (
        <tr className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
            <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                #{ticket.id}
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{ticket.servico.nome}</span>
                    <span className="text-xs text-gray-500">{ticket.servico.time.nome}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-gray-900">{ticket.funcionario.nome}</span>
                    <span className="text-xs text-gray-500">{ticket.funcionario.email}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${coresStatus[ticket.status]}`}>
                    {ticket.status === 'EM_ATENDIMENTO' ? 'Em Atendimento' : ticket.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${coresPrioridade[ticket.prioridade]}`}>
                    {ticket.prioridade}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
                {dataAbertura}
                {dataFechamento && (
                    <div className="text-xs text-gray-500">Fechado: {dataFechamento}</div>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    {ticket.status !== 'FECHADO' && (
                        <>
                            <button
                                onClick={() => atualizarStatus('EM_ATENDIMENTO')}
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-200"
                                title="Colocar em atendimento"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                            </button>
                            
                            <button
                                onClick={responderTicket}
                                className="text-green-600 hover:text-green-900 text-sm font-medium transition-colors duration-200"
                                title="Responder e fechar"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </button>
                        </>
                    )}
                    
                    {ticket.resposta && (
                        <button
                            onClick={() => alert(`Resposta: ${ticket.resposta}`)}
                            className="text-purple-600 hover:text-purple-900 text-sm font-medium transition-colors duration-200"
                            title="Ver resposta"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )
}