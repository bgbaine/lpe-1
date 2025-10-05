import type { TimeType } from "./TimeType"

export type ServicoType = {
    tickets: any
    id: number
    nome: string
    descricao?: string
    imagem?: string
    timeId: number
    createdAt: string
    updatedAt: string
    time: TimeType
}
