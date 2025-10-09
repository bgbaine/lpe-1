import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const adminSchema = z.object({
  nome: z.string().min(3, {
    message: "Nome do administrador deve possuir, no mínimo, 3 caracteres",
  }),
  email: z.string().email({
    message: "Informe um e-mail válido",
  }),
  senha: z.string().min(6, {
    message: "A senha deve conter pelo menos 6 caracteres",
  }),
  timeId: z.number({
    message: "Time é obrigatório",
  }),
});

router.get("/", async (req, res) => {
  try {
    const admin = await prisma.admin.findMany({
      include: {
        time: true
      }
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json(error);
  }
});

function validaSenha(senha: string) {
  const mensa: string[] = [];

  if (senha.length < 8)
    mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres");

  let pequenas = 0;
  let grandes = 0;
  let numeros = 0;
  let simbolos = 0;

  for (const letra of senha) {
    if (/[a-z]/.test(letra))
      pequenas++;
    else if (/[A-Z]/.test(letra))
      grandes++;
    else if (/[0-9]/.test(letra))
      numeros++;
    else
      simbolos++;
  }

  if (pequenas == 0)
    mensa.push("Erro... senha deve possuir letra(s) minúscula(s)");

  if (grandes == 0)
    mensa.push("Erro... senha deve possuir letra(s) maiúscula(s)");

  if (numeros == 0)
    mensa.push("Erro... senha deve possuir número(s)");

  if (simbolos == 0)
    mensa.push("Erro... senha deve possuir símbolo(s)");

  return mensa;
}

router.post("/", async (req, res) => {
  const valida = adminSchema.safeParse(req.body);

  if (!valida.success)
    return res.status(400).json({ erro: valida.error.format() });

  const { nome, email, senha, timeId } = valida.data;

  // Hash da senha
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(senha, salt);

  try {
    const admin = await prisma.admin.create({
      data: {
        nome,
        email,
        senha: hash,
        timeId,
      },
    });

    return res.status(201).json({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      timeId: admin.timeId
    });
  } catch (error) {
    return res.status(400).json({ erro: "Erro ao criar administrador", detalhes: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await prisma.admin.findUnique({
      where: { id },
      include: {
        time: true
      }
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
