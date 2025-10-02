import type { ServicoType } from "./utils/ServicoType"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useFuncionarioStore } from "./context/FuncionarioContext"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

type TicketInputs = {
    descricao: string
    prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'
}

export default function Servico() {
  const params = useParams()
  const navigate = useNavigate()
  const [servico, setServico] = useState<ServicoType>()
  const { funcionario } = useFuncionarioStore()
  const { register, handleSubmit, reset } = useForm<TicketInputs>()

  useEffect(() => {
    if (!funcionario.id) {
      navigate("/login")
      return
    }

    async function buscaDados() {
      const response = await fetch(`${apiUrl}/servicos/${params.servicoId}`)
      const dados = await response.json()
      setServico(dados)
    }
    buscaDados()
  }, [funcionario, navigate, params.servicoId])

  async function criarTicket(data: TicketInputs) {
    if (!funcionario.id || !servico) {
      toast.error("Erro: usuário não logado ou serviço não encontrado")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          descricao: data.descricao,
          prioridade: data.prioridade,
          funcionarioId: funcionario.id,
          servicoId: servico.id
        })
      })

      if (response.ok) {
        toast.success("Ticket criado com sucesso!")
        reset()
        navigate("/meus-chamados")
      } else {
        const error = await response.json()
        toast.error("Erro ao criar ticket: " + (error.erro || "Erro desconhecido"))
      }
    } catch (error) {
      toast.error("Erro ao criar ticket")
      console.error(error)
    }
  }

  if (!funcionario.id)
    return null

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        {servico?.imagem && (
          <img className="object-cover w-full rounded-t-lg h-96 md:h-2/4 md:w-2/4 md:rounded-none md:rounded-s-lg"
            src={servico.imagem} alt="Imagem do Serviço" />
        )}
        <div className="flex flex-col justify-between p-4 leading-normal">
          <div className="flex gap-2 mb-3">
            {servico && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {servico.time.nome}
              </span>
            )}
          </div>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {servico?.nome}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Time: {servico?.time.nome}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 whitespace-pre-wrap">
            <strong>Descrição:</strong><br />
            {servico?.descricao}
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              🎫 Criar Novo Ticket
            </h3>
            <form onSubmit={handleSubmit(criarTicket)}>
              <div className="mb-4">
                <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Descrição do Problema
                </label>
                <textarea 
                  id="descricao" 
                  className="mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                  placeholder="Descreva detalhadamente o problema que você está enfrentando..."
                  rows={4}
                  required
                  {...register('descricao', { required: true, minLength: 10 })}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="prioridade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Prioridade
                </label>
                <select 
                  id="prioridade"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register('prioridade', { required: true })}
                  defaultValue="MEDIA"
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Criar Ticket
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
