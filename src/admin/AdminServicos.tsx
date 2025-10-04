import { useEffect, useState } from "react"
import type { ServicoType } from "../utils/ServicoType"
import ItemServico from "./components/ItemServico"
import { Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminServicos() {
  const [servicos, setServicos] = useState<ServicoType[]>([])

  useEffect(() => {
    async function getServicos() {
      const response = await fetch(`${apiUrl}/servicos`)
      const dados = await response.json()
      setServicos(dados)
    }
    getServicos()
  }, [])

  const listaServicos = servicos.map(servico => (
    <ItemServico key={servico.id} servico={servico} servicos={servicos} setServicos={setServicos} />
  ))

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços disponíveis no sistema</p>
        </div>
        <Link to="/admin/novo-servico" 
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors">
          Novo Serviço
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Imagem
                </th>
                <th scope="col" className="px-6 py-3">
                  Nome do Serviço
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3">
                  Tickets
                </th>
                <th scope="col" className="px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {listaServicos}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}