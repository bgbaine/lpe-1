import { Link } from "react-router-dom"
import type { TicketType } from "../utils/TicketType"

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

export function CardTicket({data}: {data: TicketType}) {
    const dataAbertura = new Date(data.data_abertura).toLocaleDateString("pt-br")
    
    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            {data.imagem && (
                <img className="rounded-t-lg h-48 w-full object-cover" src={data.imagem} alt="Imagem do ticket" />
            )}
            <div className="p-5">
                <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${coresPrioridade[data.prioridade]}`}>
                        {data.prioridade}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${coresStatus[data.status]}`}>
                        {data.status.replace('_', ' ')}
                    </span>
                </div>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {data.servico.nome}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                    {data.descricao}
                </p>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Aberto em: {dataAbertura}
                </p>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Funcionário: {data.funcionario.nome}
                </p>
                <Link to={`/detalhes/${data.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Ver Detalhes
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}