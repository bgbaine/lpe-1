import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const ticketSchema = z.object({
  imagem: z.string().optional(),
  descricao: z.string().min(10, {
    message: "Descrição deve ter no mínimo 10 caracteres",
  }),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).default("MEDIA"),
  funcionarioId: z.string().uuid(),
  servicoId: z.number(),
  adminId: z.string().uuid().optional(),
});

router.get("/", async (req, res) => {
  try {
    const { funcionarioId } = req.query;
    
    const filtro = funcionarioId ? { funcionarioId: funcionarioId as string } : {};
    
    const tickets = await prisma.ticket.findMany({
      where: filtro,
      include: {
        funcionario: true,
        servico: {
          include: {
            time: true,
          },
        },
        admin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await prisma.ticket.findFirst({
      where: { id: Number(id) },
      include: {
        funcionario: true,
        servico: {
          include: {
            time: true,
          },
        },
        admin: true,
      },
    });
    
    if (!ticket)
      return res.status(404).json({ erro: "Ticket não encontrado" });
    
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.post("/", async (req, res) => {
  const valida = ticketSchema.safeParse(req.body);

  if (!valida.success)
    return res.status(400).json({ erro: valida.error.format() });

  const { imagem, descricao, prioridade, funcionarioId, servicoId, adminId } = valida.data;

  try {
    let ticketId: number;
    let ehUnico = false;
    
    while (!ehUnico) {
      ticketId = Math.floor(10000 + Math.random() * 90000);
      
      const ticketExistente = await prisma.ticket.findFirst({
        where: { id: ticketId }
      });
      
      if (!ticketExistente)
        ehUnico = true;
    }

    let admin = adminId;
    if (!admin) {
      const servico = await prisma.servico.findFirst({
        where: { id: servicoId },
        include: { time: { include: { admins: true } } }
      });
      
      if (servico?.time?.admins && servico.time.admins.length > 0)
        admin = servico.time.admins[0].id;
      else
        admin = funcionarioId;
    }

    const ticket = await prisma.ticket.create({
      data: {
        id: ticketId!,
        imagem,
        descricao,
        prioridade,
        data_abertura: new Date(),
        funcionarioId,
        servicoId,
        adminId: admin,
      },
      include: {
        funcionario: true,
        servico: {
          include: {
            time: true,
          },
        },
        admin: true,
      },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    return res.status(400).json({
      erro: "Erro ao criar ticket",
      detalhes: error,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const idConvertido = Number(id);
  
  if (isNaN(idConvertido)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const updateSchema = z.object({
    status: z.enum(["ABERTO", "EM_ATENDIMENTO", "FECHADO"]).optional(),
    resposta: z.string().optional(),
    prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  });

  const valida = updateSchema.safeParse(req.body);
  if (!valida.success)
    return res.status(400).json({ erro: valida.error.format() });

  const { status, resposta, prioridade } = valida.data;

  try {
    const updateData: any = {};
    
    if (status !== undefined) updateData.status = status;
    if (resposta !== undefined) updateData.resposta = resposta;
    if (prioridade !== undefined) updateData.prioridade = prioridade;
    
    if (status === "FECHADO")
      updateData.data_fechamento = new Date();

    const ticket = await prisma.ticket.update({
      where: { id: idConvertido },
      data: updateData,
      include: {
        funcionario: true,
        servico: {
          include: {
            time: true,
          },
        },
        admin: true,
      },
    });

    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(400).json({
      erro: "Erro ao atualizar ticket",
      detalhes: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await prisma.ticket.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ erro: error });
  }
});

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params;

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        OR: [
          {
            descricao: {
              contains: termo,
              mode: "insensitive",
            },
          },
          {
            servico: {
              nome: {
                contains: termo,
                mode: "insensitive",
              },
            },
          },
          {
            funcionario: {
              nome: {
                contains: termo,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        funcionario: true,
        servico: {
          include: {
            time: true,
          },
        },
        admin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao pesquisar tickets", detalhes: error });
  }
});

export default router;
