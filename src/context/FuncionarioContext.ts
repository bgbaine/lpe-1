import type { FuncionarioType } from '../utils/FuncionarioType'
import { create } from 'zustand'

type FuncionarioStore = {
    funcionario: FuncionarioType
    logaFuncionario: (funcionarioLogado: FuncionarioType) => void
    deslogaFuncionario: () => void
}

export const useFuncionarioStore = create<FuncionarioStore>((set) => ({
    funcionario: {} as FuncionarioType,
    logaFuncionario: (funcionarioLogado) => set({funcionario: funcionarioLogado}),
    deslogaFuncionario: () => set({funcionario: {} as FuncionarioType})
}))