import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import { time } from "console";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  const mensaPadrao = "Login ou senha incorretos";

  if (!email || !senha) {
    res.status(400).json({ erro: mensaPadrao });
    return;
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: { email },
      include: {
        time: true
      }
    });
    
    if (admin == null) {
      res.status(400).json({ erro: mensaPadrao });
      return;
    }
    
    if (bcrypt.compareSync(senha, admin.senha)) {
      console.log("aaa")

      const token = jwt.sign(
        {
          adminLogadoId: admin.id,
          adminLogadoNome: admin.nome,
        },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" }
      );
      
      res.status(200).json({
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        timeId: admin.timeId,
        time: admin.time,
        token,
      });
    } else {
      res.status(400).json({ erro: mensaPadrao });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
