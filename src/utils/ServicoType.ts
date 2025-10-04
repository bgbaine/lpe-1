import type { TimeType } from "./TimeType"

export type ServicoType = {
    id: number
    nome: string
    descricao?: string
    imagem?: string
    timeId: number
    createdAt: string
    updatedAt: string
    time: TimeType
}
