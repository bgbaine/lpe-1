import { useEffect } from 'react'
import Titulo from './components/Titulo.tsx'
import { Outlet } from 'react-router-dom'
import { useFuncionarioStore } from './context/FuncionarioContext'

import { Toaster } from 'sonner'

const apiUrl = import.meta.env.VITE_API_URL

export default function Layout() {
  const { funcionario, logaFuncionario } = useFuncionarioStore()

  useEffect(() => {
    if (!funcionario.id) {
      const funcionarioKey = sessionStorage.getItem("funcionarioKey") || localStorage.getItem("funcionarioKey")
      
      if (funcionarioKey) {
        async function buscaFuncionario(id: string) {
          try {
            const response = await fetch(`${apiUrl}/funcionarios/${id}`)
            if (response.ok) {
              const dados = await response.json()
              logaFuncionario(dados)
            }
          } catch (error) {
            console.error("Erro ao buscar funcionário:", error)
          }
        }
        buscaFuncionario(funcionarioKey)
      }
    }
  }, [funcionario.id, logaFuncionario])

  return (
    <>
      <Titulo />
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  )
}
