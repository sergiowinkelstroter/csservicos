// routes/home.ts
import express, { Request, Response } from "express";
import { prisma } from "../libs/prisma"; // Certifique-se de que o caminho para o prisma está correto
import { authenticateToken } from "./middlewares/authenticateToken";

const router = express.Router();

router.get("/", authenticateToken, async (req: any, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const userId = req.user.userId;

    const latestSchedule = await prisma.schedule.findMany({
      where: {
        OR: [{ status: "CONCLUIDO" }, { status: "CANCELADO" }],
        userId: userId,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    const waitingToConfirm = await prisma.schedule.findMany({
      where: {
        status: "A_CONFIRMAR",
        userId: userId,
      },
      orderBy: {
        date: "asc",
      },
      take: 5,
    });

    const nextSchedule = await prisma.schedule.findMany({
      where: {
        date: {
          gte: new Date(),
        },
        status: "AGENDADO",
        userId: userId,
      },
      orderBy: {
        date: "asc",
      },
      take: 5,
    });

    const ongoingSchedule = await prisma.schedule.findMany({
      where: {
        OR: [{ status: "EM_ANDAMENTO" }, { status: "PAUSADO" }],
        userId: userId,
      },
      orderBy: {
        date: "asc",
      },
      take: 5,
    });

    const popularServices = await prisma.service.findMany({
      orderBy: {
        usageCount: "desc",
      },
      take: 3,
    });

    const scheduleLength = await prisma.schedule.count({});

    res.json({
      latestSchedule,
      waitingToConfirm,
      nextSchedule,
      ongoingSchedule,
      popularServices,
      scheduleLength,
    });
  } catch (error) {
    console.error("Erro ao buscar dados para a página inicial:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar dados para a página inicial" });
  }
});

export default router;
