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
    updateTicketsCount: (count: number) => void
    carregaAdminSessao: () => Promise<void>
}

const adminVazio: AdminType = {
    id: '',
    nome: '',
    email: '',
    nivel: 0,
    ticketsCount: 0
}

export const useAdminStore = create<AdminStore>((set) => ({
    admin: adminVazio,
    logaAdmin: (admin: AdminType) => set({ admin }),
    deslogaAdmin: () => set({ admin: adminVazio }),
    updateTicketsCount: (count: number) => set((state) => ({ 
        admin: { ...state.admin, ticketsCount: count } 
    })),
    carregaAdminSessao: async () => {
        const adminId = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
        
        if (!adminId) return
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admins/${adminId}`)
            if (response.ok) {
                const adminData = await response.json()
                set({ admin: { ...adminData, ticketsCount: 0 } })
            } else {
                // Se o admin não existe mais, limpa o storage
                localStorage.removeItem("adminKey")
                sessionStorage.removeItem("adminKey")
            }
        } catch (error) {
            console.error("Erro ao carregar sessão do admin:", error)
            localStorage.removeItem("adminKey")
            sessionStorage.removeItem("adminKey")
        }
    }
}))