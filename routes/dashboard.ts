import { PrismaClient, Status, Prioridade } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

// Dashboard com estatísticas gerais do sistema
router.get("/gerais", async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.count()
    const tickets = await prisma.ticket.count()
    const servicos = await prisma.servico.count()
    const times = await prisma.time.count()
    
    res.status(200).json({ funcionarios, tickets, servicos, times })
  } catch (error) {
    res.status(400).json(error)
  }
})

// Estatísticas de tickets por status
router.get("/ticketsStatus", async (req, res) => {
  try {
    const ticketsAbertos = await prisma.ticket.count({
      where: { status: "ABERTO" }
    })
    
    const ticketsEmAtendimento = await prisma.ticket.count({
      where: { status: "EM_ATENDIMENTO" }
    })
    
    const ticketsFechados = await prisma.ticket.count({
      where: { status: "FECHADO" }
    })

    const ticketsStatus = [
      { status: "ABERTO", quantidade: ticketsAbertos },
      { status: "EM_ATENDIMENTO", quantidade: ticketsEmAtendimento },
      { status: "FECHADO", quantidade: ticketsFechados }
    ]

    res.status(200).json(ticketsStatus)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Estatísticas de tickets por prioridade
router.get("/ticketsPrioridade", async (req, res) => {
  try {
    const ticketsBaixa = await prisma.ticket.count({
      where: { prioridade: "BAIXA" }
    })
    
    const ticketsMedia = await prisma.ticket.count({
      where: { prioridade: "MEDIA" }
    })
    
    const ticketsAlta = await prisma.ticket.count({
      where: { prioridade: "ALTA" }
    })
    
    const ticketsCritica = await prisma.ticket.count({
      where: { prioridade: "CRITICA" }
    })

    const ticketsPrioridade = [
      { prioridade: "BAIXA", quantidade: ticketsBaixa },
      { prioridade: "MÉDIA", quantidade: ticketsMedia },
      { prioridade: "ALTA", quantidade: ticketsAlta },
      { prioridade: "CRÍTICA", quantidade: ticketsCritica }
    ]

    res.status(200).json(ticketsPrioridade)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Serviços com mais tickets
type ServicoComTickets = {
  nome: string
  _count: {
    tickets: number
  }
}

router.get("/servicosTickets", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      select: {
        nome: true,
        _count: {
          select: { tickets: true }
        }
      },
      orderBy: {
        tickets: {
          _count: 'desc'
        }
      }
    })

    const servicosTickets = servicos
      .filter((item: ServicoComTickets) => item._count.tickets > 0)
      .map((item: ServicoComTickets) => ({
        servico: item.nome,
        quantidade: item._count.tickets
      }))
    
    res.status(200).json(servicosTickets)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Funcionários que mais abriram tickets
type FuncionarioComTickets = {
  nome: string
  _count: {
    tickets: number
  }
}

router.get("/funcionariosTickets", async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      select: {
        nome: true,
        _count: {
          select: { tickets: true }
        }
      },
      orderBy: {
        tickets: {
          _count: 'desc'
        }
      }
    })

    const funcionariosTickets = funcionarios
      .filter((item: FuncionarioComTickets) => item._count.tickets > 0)
      .map((item: FuncionarioComTickets) => ({
        funcionario: item.nome,
        quantidade: item._count.tickets
      }))
    
    res.status(200).json(funcionariosTickets)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Tickets por mês (últimos 6 meses)
router.get("/ticketsMensais", async (req, res) => {
  try {
    const seisMesesAtras = new Date()
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)

    const ticketsPorMes = await prisma.ticket.groupBy({
      by: ['data_abertura'],
      where: {
        data_abertura: {
          gte: seisMesesAtras
        }
      },
      _count: {
        id: true
      }
    })

    // Agrupar por mês/ano
    const ticketsAgrupados = ticketsPorMes.reduce((acc: any, ticket) => {
      const mesAno = ticket.data_abertura.toISOString().substring(0, 7) // Formato YYYY-MM
      
      if (!acc[mesAno]) {
        acc[mesAno] = 0
      }
      acc[mesAno] += ticket._count.id
      
      return acc
    }, {})

    const ticketsMensais = Object.entries(ticketsAgrupados).map(([mes, quantidade]) => ({
      mes,
      quantidade
    }))

    res.status(200).json(ticketsMensais)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Tempo médio de resolução de tickets
router.get("/tempoMedioResolucao", async (req, res) => {
  try {
    const ticketsFechados = await prisma.ticket.findMany({
      where: {
        status: "FECHADO",
        data_fechamento: {
          not: null
        }
      },
      select: {
        data_abertura: true,
        data_fechamento: true
      }
    })

    if (ticketsFechados.length === 0) {
      return res.status(200).json({ tempoMedioHoras: 0, totalTickets: 0 })
    }

    const temposResolucao = ticketsFechados.map(ticket => {
      const abertura = new Date(ticket.data_abertura)
      const fechamento = new Date(ticket.data_fechamento!)
      return (fechamento.getTime() - abertura.getTime()) / (1000 * 60 * 60) // Converter para horas
    })

    const tempoMedioHoras = temposResolucao.reduce((acc, tempo) => acc + tempo, 0) / temposResolucao.length

    res.status(200).json({
      tempoMedioHoras: Math.round(tempoMedioHoras * 100) / 100, // Arredondar para 2 casas decimais
      totalTickets: ticketsFechados.length
    })
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router