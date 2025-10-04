import type { ServicoType } from "../utils/ServicoType"
import { toast } from "sonner"

type ItemServicoProps = {
    servico: ServicoType
    servicos: ServicoType[]
    setServicos: React.Dispatch<React.SetStateAction<ServicoType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemServico({ servico, servicos, setServicos }: ItemServicoProps) {
    
    async function excluirServico() {
        if (!confirm(`Tem certeza que deseja excluir o serviço "${servico.nome}"?`)) {
            return
        }

        try {
            const response = await fetch(`${apiUrl}/servicos/${servico.id}`, {
                method: "DELETE"
            })

            if (response.ok) {
                const servicosAtualizados = servicos.filter(s => s.id !== servico.id)
                setServicos(servicosAtualizados)
                toast.success("Serviço excluído com sucesso!")
            } else {
                toast.error("Erro ao excluir serviço")
            }
        } catch (error) {
            toast.error("Erro ao excluir serviço")
        }
    }

    return (
        <tr className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
            <td className="px-6 py-4">
                {servico.imagem ? (
                    <img 
                        src={servico.imagem} 
                        alt={servico.nome}
                        className="w-12 h-12 object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        </svg>
                    </div>
                )}
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{servico.nome}</span>
                    <span className="text-xs text-gray-500">ID: {servico.id}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {servico.time.nome}
                </span>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                    {servico.descricao || "Sem descrição"}
                </p>
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {servico.tickets?.length || 0} tickets
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={excluirServico}
                        className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors duration-200"
                        title="Excluir serviço"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    )
}