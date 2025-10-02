import type { TicketType } from "./utils/TicketType"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

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

export default function Detalhes() {
  const params = useParams()
  const [ticket, setTicket] = useState<TicketType>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/tickets/${params.ticketId}`)
      const dados = await response.json()
      setTicket(dados)
    }
    buscaDados()
  }, [])

  const dataAbertura = ticket ? new Date(ticket.data_abertura).toLocaleDateString("pt-br") : ""
  const dataFechamento = ticket?.data_fechamento ? new Date(ticket.data_fechamento).toLocaleDateString("pt-br") : ""

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        {ticket?.imagem && (
          <img className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
            src={ticket.imagem} alt="Imagem do Ticket" />
        )}
        <div className="flex flex-col justify-between p-4 leading-normal">
          <div className="flex gap-2 mb-3">
            {ticket && (
              <>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${coresPrioridade[ticket.prioridade]}`}>
                  {ticket.prioridade}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${coresStatus[ticket.status]}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </>
            )}
          </div>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Ticket #{ticket?.id} - {ticket?.servico.nome}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Team: {ticket?.servico.time.nome}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Funcionário: {ticket?.funcionario.nome}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Data de Abertura: {dataAbertura}
          </h5>
          {dataFechamento && (
            <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
              Data de Fechamento: {dataFechamento}
            </h5>
          )}
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 whitespace-pre-wrap">
            <strong>Descrição:</strong><br />
            {ticket?.descricao}
          </p>
          
          {/* Admin status information */}
          {ticket?.adminId && ticket.adminId !== ticket.funcionarioId ? (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                👨‍💼 Ticket Atribuído
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                <strong>Admin Responsável:</strong> {ticket.admin?.nome}<br />
                <strong>Email:</strong> {ticket.admin?.email}
              </p>
            </div>
          ) : (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900 dark:border-yellow-700">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ⏳ Aguardando Atendimento
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Seu ticket ainda não foi atendido. Um administrador será atribuído em breve.
              </p>
            </div>
          )}

          {ticket?.resposta && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900 dark:border-green-700">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                ✅ Resposta do Administrador
              </h3>
              <p className="text-green-700 dark:text-green-300 whitespace-pre-wrap">
                {ticket.resposta}
              </p>
            </div>
          )}
          
          {ticket?.status === 'FECHADO' && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                🔒 Ticket Finalizado
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Este ticket foi fechado em {dataFechamento}.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}