import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const router = Router();

const timesSchema = z.object({
  nome: z.string().min(3, {
    message: "Nome deve possuir, no mínimo, 3 caracteres",
  }),
  descricao: z.string().optional(),
});

router.get("/", async (req, res) => {
  try {
    const times = await prisma.time.findMany();
    res.status(200).json(times);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.post("/", async (req, res) => {
  const valida = timesSchema.safeParse(req.body);

  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.format() });
  }

  const { nome, descricao } = valida.data;

  try {
    const time = await prisma.time.create({
      data: {
        nome,
        descricao,
      },
    });

    return res.status(201).json(time);
  } catch (error) {
    return res.status(400).json({
      erro: "Erro ao criar time",
      detalhes: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const time = await prisma.time.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(time);
  } catch (error) {
    res.status(400).json({ erro: error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const timeId = Number(id);

  if (isNaN(timeId)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  const valida = timesSchema.safeParse(req.body);
  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.format() });
  }

  const { nome, descricao } = valida.data;

  try {
    const time = await prisma.time.update({
      where: { id: timeId },
      data: {
        nome,
        descricao,
      },
    });

    return res.status(200).json(time);
  } catch (error) {
    return res.status(400).json({
      erro: "Erro ao atualizar time",
      detalhes: error,
    });
  }
});

export default router;
