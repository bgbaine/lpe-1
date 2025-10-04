import type { TimeType } from "./TimeType"

export type AdminType = {
    id: string
    nome: string
    senha: string
    email: string
    timeId: number
    time: TimeType
}
