import { prisma } from "../libs/prisma";
import express, { Request, Response, Router } from "express";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "./middlewares/authenticateToken";
import {
  createBackup,
  deleteBackup,
  restoreBackup,
  restoreFullBackup,
} from "../libs/backup-services";

const router = express.Router();

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
          .json({ error: "Apenas administradores podem buscar backups" });
      }

      const backups = await prisma.backups.findMany();
      res.json(backups);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar backups" });
    }
  }
);

router.post(
  "/register",
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
          .json({ error: "Apenas administradores podem registrar backups" });
      }

      const backup = await createBackup(user.id);
      res.send(backup);
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar backup!" });
    }
  }
);

router.put(
  "/restore/:backupId/:userId",
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
          .json({ error: "Apenas administradores podem restaurar backups" });
      }

      const { backupId, userId: backupUserId } = req.params;

      await restoreBackup(Number(backupUserId), Number(backupId));
      res.send({ message: "Backup restaurado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao restaurar backup!" });
    }
  }
);

router.patch(
  "/restore-full/backupId",
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
          .json({ error: "Apenas administradores podem restaurar backups" });
      }

      const { backupId } = req.params;

      await restoreFullBackup(Number(backupId));
      res.send({ message: "Backup restaurado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao restaurar backup!" });
    }
  }
);

router.delete(
  "/delete/backupId",
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
          .json({ error: "Apenas administradores podem deletar backups" });
      }

      const { backupId } = req.params;

      await deleteBackup(Number(backupId));

      res.send({ message: "Backup deletado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar backup!" });
    }
  }
);

export default router;
