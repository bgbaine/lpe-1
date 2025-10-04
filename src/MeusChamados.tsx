import { useEffect, useState } from "react"
import { useFuncionarioStore } from "./context/FuncionarioContext"
import type { TicketType } from "./utils/TicketType"
import { Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

const coresPrioridade = {
    BAIXA: "bg-green-100 text-green-800",
    MEDIA: "bg-yellow-100 text-yellow-800", 
    ALTA: "bg-orange-100 text-orange-800",
    CRITICA: "bg-red-100 text-red-800"
}

const coresStatus = {
    ABERTO: "bg-blue-100 text-blue-800",
    EM_ATENDIMENTO: "bg-purple-100 text-purple-800",
    FECHADO: "bg-gray-100 text-gray-800"
}

export default function MeusChamados() {
    const { funcionario } = useFuncionarioStore()
    const [tickets, setTickets] = useState<TicketType[]>([])

    useEffect(() => {
        async function buscaMeusChamados() {
            if (funcionario.id) {
                const response = await fetch(`${apiUrl}/tickets?funcionarioId=${funcionario.id}`)
                const dados = await response.json()
                setTickets(dados)
            }
        }
        buscaMeusChamados()
    }, [funcionario])

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Meus Chamados</h1>
            
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Ticket</th>
                            <th scope="col" className="px-6 py-3">Serviço</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Prioridade</th>
                            <th scope="col" className="px-6 py-3">Data Abertura</th>
                            <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    #{ticket.id}
                                </td>
                                <td className="px-6 py-4">
                                    {ticket.servico.nome}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${coresStatus[ticket.status]}`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${coresPrioridade[ticket.prioridade]}`}>
                                        {ticket.prioridade}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(ticket.data_abertura).toLocaleDateString("pt-br")}
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/detalhes/${ticket.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Ver Detalhes
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {tickets.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    Nenhum chamado encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}