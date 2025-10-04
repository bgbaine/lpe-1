import { useEffect, useState } from "react"

const apiUrl = import.meta.env.VITE_API_URL

type DashboardData = {
    funcionarios: number
    tickets: number
    servicos: number
    times: number
    admins: number
}

type TicketStatus = {
    status: string
    quantidade: number
}

type TicketPrioridade = {
    prioridade: string
    quantidade: number
}

export default function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [ticketsStatus, setTicketsStatus] = useState<TicketStatus[]>([])
    const [ticketsPrioridade, setTicketsPrioridade] = useState<TicketPrioridade[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function carregaDashboard() {
            try {
                setLoading(true)
                
                // Carrega dados gerais
                const responseGerais = await fetch(`${apiUrl}/dashboard/gerais`)
                const dadosGerais = await responseGerais.json()
                setDashboardData(dadosGerais)

                // Carrega tickets por status
                const responseStatus = await fetch(`${apiUrl}/dashboard/ticketsStatus`)
                const dadosStatus = await responseStatus.json()
                setTicketsStatus(dadosStatus)

                // Carrega tickets por prioridade
                const responsePrioridade = await fetch(`${apiUrl}/dashboard/ticketsPrioridade`)
                const dadosPrioridade = await responsePrioridade.json()
                setTicketsPrioridade(dadosPrioridade)

            } catch (error) {
                console.error("Erro ao carregar dashboard:", error)
            } finally {
                setLoading(false)
            }
        }

        carregaDashboard()
    }, [])

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Visão geral do sistema HelpDesk</p>
            </div>

            {/* Stats Grid */}
            {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Funcionários</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.funcionarios}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tickets</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.tickets}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Serviços</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.servicos}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Times</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.times}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Admins</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardData.admins}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tickets por Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets por Status</h3>
                    <div className="space-y-3">
                        {ticketsStatus.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">{item.status}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full bg-blue-600" 
                                            style={{ width: `${(item.quantidade / Math.max(...ticketsStatus.map(t => t.quantidade))) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.quantidade}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tickets por Prioridade */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets por Prioridade</h3>
                    <div className="space-y-3">
                        {ticketsPrioridade.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">{item.prioridade}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                item.prioridade === 'CRÍTICA' ? 'bg-red-600' :
                                                item.prioridade === 'ALTA' ? 'bg-orange-600' :
                                                item.prioridade === 'MÉDIA' ? 'bg-yellow-600' : 'bg-green-600'
                                            }`}
                                            style={{ width: `${(item.quantidade / Math.max(...ticketsPrioridade.map(t => t.quantidade))) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.quantidade}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}