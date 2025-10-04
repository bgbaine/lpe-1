import type { ServicoType } from "./ServicoType"
import type { FuncionarioType } from "./FuncionarioType"
import type { AdminType } from "./AdminType"

export type TicketType = {
    id: number
    imagem?: string
    descricao: string
    data_abertura: string
    status: 'ABERTO' | 'EM_ATENDIMENTO' | 'FECHADO'
    prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'
    resposta?: string
    data_fechamento?: string
    createdAt: string
    updatedAt: string
    funcionarioId: string
    servicoId: number
    adminId: string
    funcionario: FuncionarioType
    servico: ServicoType
    admin: AdminType
}