import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const funcionarioSchema = z.object({
  nome: z.string().min(10, {
    message: "Nome do cliente deve possuir, no mínimo, 10 caracteres",
  }),
  email: z.string().email({
    message: "Informe um e-mail válido",
  }),
  senha: z.string().min(6, {
    message: "A senha deve conter pelo menos 6 caracteres",
  }),
  cargo: z.string().optional(),
});

router.get("/", async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    res.status(200).json(funcionarios);
  } catch (error) {
    res.status(400).json(error);
  }
});

function validaSenha(senha: string) {
  const mensa: string[] = [];

  // .length: retorna o tamanho da string (da senha)
  if (senha.length < 8) {
    mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres");
  }

  // contadores
  let pequenas = 0;
  let grandes = 0;
  let numeros = 0;
  let simbolos = 0;

  // senha = "abc123"
  // letra = "a"

  // percorre as letras da variável senha
  for (const letra of senha) {
    // expressão regular
    if (/[a-z]/.test(letra)) {
      pequenas++;
    } else if (/[A-Z]/.test(letra)) {
      grandes++;
    } else if (/[0-9]/.test(letra)) {
      numeros++;
    } else {
      simbolos++;
    }
  }

  if (pequenas == 0) {
    mensa.push("Erro... senha deve possuir letra(s) minúscula(s)");
  }

  if (grandes == 0) {
    mensa.push("Erro... senha deve possuir letra(s) maiúscula(s)");
  }

  if (numeros == 0) {
    mensa.push("Erro... senha deve possuir número(s)");
  }

  if (simbolos == 0) {
    mensa.push("Erro... senha deve possuir símbolo(s)");
  }

  return mensa;
}


router.post("/", async (req, res) => {
  const valida = funcionarioSchema.safeParse(req.body);

  if (!valida.success) {
    return res.status(400).json({ erro: valida.error.format() });
  }

  const { nome, email, senha, cargo } = valida.data;

  const erros = validaSenha(senha);
  if (erros.length > 0) {
    return res.status(400).json({ erro: erros.join("; ") });
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(senha, salt);

  try {
    const funcionario = await prisma.funcionario.create({
      data: {
        nome,
        email,
        senha: hash,
        cargo,
      },
    });

    return res.status(201).json(funcionario);
  } catch (error) {
    return res.status(400).json({ erro: "Erro ao criar funcionário", detalhes: error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { id },
    });
    res.status(200).json(funcionario);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
