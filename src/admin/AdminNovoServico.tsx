import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { TimeType } from "../utils/TimeType"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  nome: string
  descricao: string
  imagem: string
  timeId: number
}

export default function AdminNovoServico() {
  const [times, setTimes] = useState<TimeType[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setFocus
  } = useForm<Inputs>()

  useEffect(() => {
    async function getTimes() {
      const response = await fetch(`${apiUrl}/times`)
      const dados = await response.json()
      setTimes(dados)
    }
    getTimes()
    setFocus("nome")
  }, [])

  const optionsTime = times.map(time => (
    <option key={time.id} value={time.id}>{time.nome}</option>
  ))

  async function incluirServico(data: Inputs) {
    const novoServico: Inputs = {
      nome: data.nome,
      descricao: data.descricao,
      imagem: data.imagem,
      timeId: Number(data.timeId)
    }

    const response = await fetch(`${apiUrl}/servicos`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(novoServico)
      },
    )

    if (response.status == 201) {
      toast.success("Serviço cadastrado com sucesso!")
      reset()
    } else {
      toast.error("Erro no cadastro do serviço...")
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Serviço</h1>
        <p className="text-gray-600">Adicione um novo serviço ao sistema HelpDesk</p>
      </div>

      <form className="max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200" onSubmit={handleSubmit(incluirServico)}>
        <div className="mb-4">
          <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900">
            Nome do Serviço
          </label>
          <input 
            type="text" 
            id="nome"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            required
            placeholder="Ex: Suporte Técnico, Manutenção de Software..."
            {...register("nome")}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="timeId" className="block mb-2 text-sm font-medium text-gray-900">
            Time Responsável
          </label>
          <select 
            id="timeId"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            required
            {...register("timeId")}
          >
            <option value="">Selecione um time</option>
            {optionsTime}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="imagem" className="block mb-2 text-sm font-medium text-gray-900">
            URL da Imagem (Opcional)
          </label>
          <input 
            type="text" 
            id="imagem"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="https://exemplo.com/imagem.jpg"
            {...register("imagem")}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900">
            Descrição do Serviço
          </label>
          <textarea 
            id="descricao" 
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva detalhadamente o serviço oferecido..."
            {...register("descricao")}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center transition-colors"
        >
          Cadastrar Serviço
        </button>
      </form>
    </div>
  )
}