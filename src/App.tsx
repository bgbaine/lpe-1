import { CardServico } from "./components/CardServico";
import type { ServicoType } from "./utils/ServicoType";
import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [servicos, setServicos] = useState<ServicoType[]>([])
  const [servicosFiltrados, setServicosFiltrados] = useState<ServicoType[]>([])
  const [termoPesquisa, setTermoPesquisa] = useState("")  

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/servicos`)
      const dados = await response.json()
      setServicos(dados)
      setServicosFiltrados(dados)
    }
    buscaDados()
  }, [])

  useEffect(() => {
    if (!termoPesquisa.trim()) {
      setServicosFiltrados(servicos)
    } else {
      const filtrados = servicos.filter(servico => 
        servico.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        servico.descricao?.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        servico.time.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
      )
      setServicosFiltrados(filtrados)
    }
  }, [termoPesquisa, servicos])

  const listaServicos = servicosFiltrados.map( servico => (
    <CardServico data={servico} key={servico.id} />
  ))

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              Serviços{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Disponíveis
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Encontre e solicite os serviços de TI que você precisa com facilidade e rapidez
            </p>
          </div>
          
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Pesquisar serviços por nome, descrição ou time..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="w-full px-4 py-3 pl-12 text-sm text-slate-900 bg-white rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setTermoPesquisa("")}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                title="Limpar pesquisa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listaServicos}
          </div>
          
          {servicosFiltrados.length === 0 && servicos.length > 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0121 12a8 8 0 10-2.343 5.657l2.343 2.343-2.343-2.343z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum serviço encontrado</h3>
              <p className="text-slate-600 mb-4">
                Não encontramos serviços que correspondam à sua pesquisa por "{termoPesquisa}".
              </p>
              <button 
                onClick={() => setTermoPesquisa("")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                Limpar filtros
              </button>
            </div>
          )}
          
          {/* {servicos.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum serviço disponível</h3>
              <p className="text-slate-600">
                No momento não há serviços disponíveis. Tente novamente mais tarde.
              </p>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
