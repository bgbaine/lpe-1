import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const router = Router();

const servicoSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome do serviço deve ter no mínimo 2 caracteres",
  }),
  descricao: z.string().optional(),
  timeId: z.number({
    required_error: "O ID do time é obrigatório",
    invalid_type_error: "O ID do time deve ser um número",
  }),
});

router.get("/", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      include: {
        time: true,
        tickets: true,
      },
    });
    res.status(200).json(servicos);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const servico = await prisma.servico.findFirst({
      where: { id: Number(id) },
      include: {
        time: true,
        tickets: true,
      },
    });
    res.status(200).json(servico);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.post("/", async (req, res) => {
  const valida = servicoSchema.safeParse(req.body);

  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.format() });
  }

  const { nome, descricao, timeId } = valida.data;

  try {
    const servico = await prisma.servico.create({
      data: {
        nome,
        descricao,
        timeId,
      },
    });

    return res.status(201).json(servico);
  } catch (error) {
    return res.status(400).json({
      erro: "Erro ao criar serviço",
      detalhes: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const servico = await prisma.servico.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(servico);
  } catch (error) {
    res.status(400).json({ erro: error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const valida = servicoSchema.safeParse(req.body);
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.format() });
  }

  const { nome, descricao, timeId } = valida.data;

  try {
    const servico = await prisma.servico.update({
      where: { id: parsedId },
      data: {
        nome,
        descricao,
        timeId,
      },
    });

    return res.status(200).json(servico);
  } catch (error) {
    return res.status(400).json({
      erro: "Erro ao atualizar serviço",
      detalhes: error,
    });
  }
});

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params;

  const termoNumero = Number(termo);
  const isNumero = !isNaN(termoNumero);

  try {
    const servicos = await prisma.servico.findMany({
      where: {
        OR: [
          {
            nome: {
              contains: termo,
              mode: "insensitive",
            },
          },
          {
            descricao: {
              contains: termo,
              mode: "insensitive",
            },
          },
          ...(isNumero ? [{ timeId: termoNumero }] : []),
        ],
      },
      include: {
        time: true,
      },
    });

    res.status(200).json(servicos);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao pesquisar serviços", detalhes: error });
  }
});

export default router;
