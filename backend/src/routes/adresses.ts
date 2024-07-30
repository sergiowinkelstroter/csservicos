import express, { Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { z } from "zod";
import { authenticateToken } from "./middlewares/authenticateToken";

const router = express.Router();

const createAddressSchema = z.object({
  userId: z.number(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  number: z.number(),
});

const updateAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  number: z.number().optional(),
});

router.post(
  "/register",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const validation = createAddressSchema.safeParse(req.body);
      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const address = await prisma.address.create({
        data: validation.data,
      });

      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar endereço" });
    }
  }
);

router.get("/list", authenticateToken, async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.address.findMany();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar endereços" });
  }
});

router.get(
  "/list/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const address = await prisma.address.findMany({
        where: { userId: Number(id) },
      });

      if (!address) {
        return res.status(404).json({ error: "Endereços não encontrado" });
      }

      res.json(address);
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter endereço" });
    }
  }
);

router.put(
  "/edit/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validation = updateAddressSchema.safeParse(req.body);

      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const address = await prisma.address.update({
        where: { id: Number(id) },
        data: validation.data,
      });

      res.json(address);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar endereço" });
    }
  }
);

router.delete(
  "/delete/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.address.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir endereço" });
    }
  }
);

export default router;
