import { Link, useNavigate } from "react-router-dom"
import type { ServicoType } from "../utils/ServicoType"
import { useFuncionarioStore } from "../context/FuncionarioContext"

export function CardServico({data}: {data: ServicoType}) {
    const { funcionario } = useFuncionarioStore()
    const navigate = useNavigate()

    function clickHandle(e: React.MouseEvent) {
        if (!funcionario.id) {
            e.preventDefault()
            navigate("/login")
        }
    }

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {data.imagem && (
                <div className="relative overflow-hidden">
                    <img 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                        src={data.imagem} 
                        alt="Imagem do serviço" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            )}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {data.time.nome}
                    </span>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    {data.nome}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {data.descricao}
                </p>
                
                <Link 
                    to={`/servico/${data.id}`} 
                    onClick={clickHandle}
                    className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Solicitar Serviço
                    <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </Link>
            </div>
        </div>
    )
}
