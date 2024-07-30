import { prisma } from "../libs/prisma";
import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "./middlewares/authenticateToken";

const router: Router = express.Router();

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(30, "Nome deve ter menos de 30 caracteres"),
  email: z.string().email("Email inválido"),
  fone: z.string().min(10, "Fone inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  fone: z.string().optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string().min(6),
});

router.get(
  "/list",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userId = req.user.userId;

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (user?.role !== "ADMIN") {
        return res
          .status(401)
          .json({ error: "Apenas administradores podem buscar usuários" });
      }

      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }
);

router.get(
  "/providers/list",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userId = req.user.userId;

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (user?.role !== "ADMIN") {
        return res.status(401).json({
          error: "Apenas administradores podem buscar usuários/prestadores",
        });
      }

      const users = await prisma.user.findMany({
        where: { role: "PRESTADOR" },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }
);

router.post("/register", async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const { name, email, fone, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        fone,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

router.get(
  "/profile",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const user = await prisma.user.findUnique({
        where: { id: Number(req.user.userId) },
        include: {
          addresses: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      user.password = "";

      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

router.put(
  "/update-role",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId, newRole } = req.body;
      if (!req.user?.userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const user_id = req.user.userId;

      const user = await prisma.user.findUnique({
        where: { id: Number(user_id) },
      });

      if (user?.role !== "ADMIN") {
        return res
          .status(401)
          .json({ error: "Apenas administradores podem atualizar o role" });
      }

      if (!["CLIENTE", "PRESTADOR", "ADMIN"].includes(newRole)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar o role do usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar o role do usuário" });
    }
  }
);

router.put(
  "/update-notification/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { notification } = req.body;
      const user = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          notification,
        },
      });
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Erro ao atualizar a configuração das notificações do usuário",
        });
    }
  }
);

router.put(
  "/edit/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const validation = updateUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const { id } = req.params;
      const updatedData = validation.data;

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updatedData,
      });

      res.json(user);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }
);

router.delete(
  "/delete/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ error: "Erro ao excluir usuário" });
    }
  }
);

router.put(
  "/change-password/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const validation = changePasswordSchema.safeParse(req.body);
      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const { oldPassword, newPassword } = validation.data;
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (!user.password) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await prisma.user.update({
          where: { id: Number(id) },
          data: { password: hashedNewPassword },
        });
        return res.json(updatedUser);
      }

      if (oldPassword) {
        const isPasswordValid = await bcrypt.compare(
          oldPassword,
          user.password
        );
        if (!isPasswordValid) {
          return res.status(400).json({ error: "Senha antiga incorreta" });
        }
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: { password: hashedNewPassword },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Erro ao alterar senha do usuário:", error);
      res.status(500).json({ error: "Erro ao alterar senha do usuário" });
    }
  }
);

export default router;
