import { create } from 'zustand'

interface AdminType {
    ticketsCount: number
    id: string
    nome: string
    email: string
    nivel: number
    token?: string
}

interface AdminStore {
    admin: AdminType
    logaAdmin: (admin: AdminType) => void
    deslogaAdmin: () => void
}

const adminVazio: AdminType = {
    id: '',
    nome: '',
    email: '',
    nivel: 0
}

export const useAdminStore = create<AdminStore>((set) => ({
    admin: adminVazio,
    logaAdmin: (admin: AdminType) => set({ admin }),
    deslogaAdmin: () => set({ admin: adminVazio })
}))