import { ScheduleStatus } from "@prisma/client";
import { prisma } from "../libs/prisma";
import express, { Request, Response, Router } from "express";
import { z } from "zod";
import {
  AuthenticatedRequest,
  authenticateToken,
} from "./middlewares/authenticateToken";
import { api_notify } from "../libs/notify";
import dotenv from "dotenv";
import { formatDatePtBr } from "../utils/formatDateBr";
dotenv.config();

const router: Router = express.Router();

const createScheduleSchema = z.object({
  userId: z.number().optional(),
  serviceId: z.number().int().positive("ID do serviço é obrigatório"),
  title: z.string().nonempty("Título é obrigatório"),
  description: z.string().optional(),
  date: z
    .string()
    .nonempty("Data do agendamento é obrigatória")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  time: z.string().nonempty("Hora do agendamento é obrigatória"),
  status: z.nativeEnum(ScheduleStatus),
  addressId: z.number(),
});

router.post(
  "/register",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userIdReq = Number(req.user.userId);

      const validation = createScheduleSchema.safeParse(req.body);
      if (!validation.success) {
        console.error("Validation error:", validation.error);
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const {
        serviceId,
        title,
        description,
        date,
        time,
        status,
        addressId,
        userId,
      } = validation.data;

      const schedule = await prisma.schedule.create({
        data: {
          userId: userId ? userId : userIdReq,
          serviceId,
          title,
          description,
          date: new Date(date),
          time,
          status,
          addressId,
        },
      });

      res.status(201).json(schedule);
    } catch (error) {
      console.error("Error creating schedule:", error);
      res.status(500).json({ error: "Erro ao criar agendamento" });
    }
  }
);

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
        return res.status(401).json({
          error: "Apenas administradores podem buscar agendamentos",
        });
      }

      const schedules = await prisma.schedule.findMany({
        include: {
          address: true,
          service: {
            include: {
              category: true,
            },
          },
          provider: true,
          user: true,
        },
      });
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  }
);

router.get(
  "/list/:userId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "ID do usuário inválido" });
      }

      const schedules = await prisma.schedule.findMany({
        where: { userId },
        include: {
          address: true,
          service: {
            include: {
              category: true,
            },
          },
        },
      });

      console.log(schedules);

      res.json(schedules);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao listar agendamentos por usuário" });
    }
  }
);

router.get(
  "/provider/list/:providerId",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { providerId } = req.params;

    try {
      const schedules = await prisma.schedule.findMany({
        where: { providerId: Number(providerId) },
        include: {
          address: true,
          service: {
            include: {
              category: true,
            },
          },
          user: true,
        },
      });
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  }
);

const updateScheduleSchema = createScheduleSchema.partial().extend({
  id: z.number().int().positive("ID do agendamento é obrigatório"),
});

router.put(
  "/edit/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const validation = updateScheduleSchema.safeParse({
        ...req.body,
        id: Number(req.params.id),
      });
      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const { id, ...data } = validation.data;

      const schedule = await prisma.schedule.update({
        where: { id: Number(id) },
        data: {
          ...data,
          date: data.date ? new Date(data.date) : undefined,
          time: data.time ? data.time : undefined,
        },
      });

      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar agendamento" });
    }
  }
);

const statusSchema = z.enum([
  "A_CONFIRMAR",
  "AGENDADO",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
  "PAUSADO",
]);

router.put(
  "/update-status/confirm/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status, providerId } = req.body;

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
          error: "Apenas administradores podem confirmar agendamentos",
        });
      }

      statusSchema.parse(status);

      let updatedSchedule;

      if (providerId) {
        const providerExists = await prisma.user.findUnique({
          where: { id: Number(providerId) },
        });

        if (!providerExists) {
          return res.status(400).json({ error: "Invalid provider ID" });
        }

        if (providerExists.role !== "PRESTADOR") {
          return res
            .status(400)
            .json({ error: "Esse usuário não é um prestador" });
        }

        updatedSchedule = await prisma.schedule.update({
          where: { id: Number(id) },
          data: { status, providerId },
        });

        if (providerExists.fone === null) {
          return res.status(400).json({ error: "Prestador sem telefone" });
        }

        if (providerExists.notification === "A") {
          const number = `55${providerExists?.fone.replace(/[^0-9]/g, "")}`;
          const message =
            `Olá ${providerExists.name}, um novo serviço foi solicitado.\n\n` +
            `⛏️ Serviço: ${updatedSchedule?.title}\n` +
            `📅 Data: ${formatDatePtBr(String(updatedSchedule?.date))}\n` +
            `🕝 Hora: ${updatedSchedule?.time}hrs\n\n` +
            `Acesse o site e confira mais detalhes.`;
          await api_notify.post(`/${process.env.INSTANCE}`, {
            number: number,
            textMessage: {
              text: message,
            },
          });
        }

        const client = await prisma.user.findUnique({
          where: { id: updatedSchedule.userId },
        });

        if (!client || client.fone === null) {
          return res.status(400).json({ error: "Invalid client ID" });
        }

        if (client.notification === "A") {
          const number = `55${client.fone.replace(/[^0-9]/g, "")}`;
          const message =
            `Olá ${client.name}, o seu agendamento foi confirmado.\n\n` +
            `⛏️ Serviço: ${updatedSchedule?.title}\n` +
            `📅 Data: ${formatDatePtBr(String(updatedSchedule?.date))}\n` +
            `🕝 Hora: ${updatedSchedule?.time}hrs\n\n` +
            `Acesse o site e confira mais detalhes.`;

          await api_notify.post(`/${process.env.INSTANCE}`, {
            number: number,
            textMessage: {
              text: message,
            },
          });
        }
      } else {
        return res.status(400).json({ error: "Prestador não informado" });
      }
      return res.status(200).json(updatedSchedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid status value" });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to update schedule status" });
      }
    }
  }
);

router.put("/update-status/start/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    statusSchema.parse(status);
    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: { status },
    });

    const cliente = await prisma.user.findUnique({
      where: { id: updatedSchedule.userId },
    });

    if (!cliente || cliente.fone === null) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    if (cliente.notification === "A") {
      const number = `55${cliente.fone.replace(/[^0-9]/g, "")}`;
      const today = new Date();
      const message =
        `Olá ${cliente.name}, o serviço foi iniciado.\n\n` +
        `⛏️ Serviço: ${updatedSchedule?.title}\n` +
        `📅 Data: ${formatDatePtBr(String(today))}\n` +
        `🕝 Hora: ${today.getHours()}:${today.getMinutes()}\n\n` +
        `Acesse o site e confira mais detalhes.`;
      await api_notify.post(`/${process.env.INSTANCE}`, {
        number: number,
        textMessage: {
          text: message,
        },
      });
    }

    return res.status(200).json(updatedSchedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid status value" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to update schedule status" });
    }
  }
});

router.put("/update-status/pause/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    statusSchema.parse(status);
    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: { status },
    });

    const cliente = await prisma.user.findUnique({
      where: { id: updatedSchedule.userId },
    });

    if (!cliente || cliente.fone === null) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    console.log(cliente);

    if (cliente.notification === "A") {
      const number = `55${cliente.fone.replace(/[^0-9]/g, "")}`;
      const today = new Date();
      const message =
        `Olá ${cliente.name}, o serviço foi pausado.\n\n` +
        `⛏️ Serviço: ${updatedSchedule?.title}\n` +
        `📅 Data: ${formatDatePtBr(String(today))}\n` +
        `🕝 Hora: ${today.getHours()}:${today.getMinutes()}\n\n` +
        `Acesse o site e confira mais detalhes.`;

      await api_notify.post(`/${process.env.INSTANCE}`, {
        number: number,
        textMessage: {
          text: message,
        },
      });
    }

    return res.status(200).json(updatedSchedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid status value" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to update schedule status" });
    }
  }
});

router.put(
  "/update-status/restart/:id",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      statusSchema.parse(status);
      const updatedSchedule = await prisma.schedule.update({
        where: { id: Number(id) },
        data: { status },
      });

      const cliente = await prisma.user.findUnique({
        where: { id: updatedSchedule.userId },
      });

      if (!cliente || cliente.fone === null) {
        return res.status(400).json({ error: "Invalid client ID" });
      }

      if (cliente.notification === "A") {
        const number = `55${cliente.fone.replace(/[^0-9]/g, "")}`;
        const today = new Date();
        const message =
          `Olá ${cliente.name}, o serviço foi reiniciado.\n\n` +
          `⛏️ Serviço: ${updatedSchedule?.title}\n` +
          `📅 Data: ${formatDatePtBr(String(today))}\n` +
          `🕝 Hora: ${today.getHours()}:${today.getMinutes()}\n\n` +
          `Acesse o site e confira mais detalhes.`;

        await api_notify.post(`/${process.env.INSTANCE}`, {
          number: number,
          textMessage: {
            text: message,
          },
        });
      }

      return res.status(200).json(updatedSchedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid status value" });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to update schedule status" });
      }
    }
  }
);

router.put("/update-status/finish/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    statusSchema.parse(status);
    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: { status },
    });

    const cliente = await prisma.user.findUnique({
      where: { id: updatedSchedule.userId },
    });

    if (!cliente || cliente.fone === null) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    if (cliente.notification === "A") {
      const number = `55${cliente.fone.replace(/[^0-9]/g, "")}`;
      const today = new Date();
      const message =
        `Olá ${cliente.name}, o serviço foi finalizado.\n\n` +
        `⛏️ Serviço: ${updatedSchedule?.title}\n` +
        `📅 Data: ${formatDatePtBr(String(today))}\n` +
        `🕝 Hora: ${today.getHours()}:${today.getMinutes()}\n\n` +
        `Acesse o site e confira mais detalhes.`;

      await api_notify.post(`/${process.env.INSTANCE}`, {
        number: number,
        textMessage: {
          text: message,
        },
      });
    }

    return res.status(200).json(updatedSchedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid status value" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to update schedule status" });
    }
  }
});

router.put("/update-status/cancel/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    statusSchema.parse(status);
    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: { status },
    });

    const cliente = await prisma.user.findUnique({
      where: { id: updatedSchedule.userId },
    });

    if (!cliente || cliente.fone === null) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    if (cliente.notification === "A") {
      const number = `55${cliente.fone.replace(/[^0-9]/g, "")}`;
      const today = new Date();
      const message =
        `Olá ${cliente.name}, o serviço foi cancelado.\n\n` +
        `⛏️ Serviço: ${updatedSchedule?.title}\n` +
        `📅 Data: ${formatDatePtBr(String(today))}\n` +
        `🕝 Hora: ${today.getHours()}:${today.getMinutes()}\n\n` +
        `Acesse o site e confira mais detalhes.`;

      await api_notify.post(`/${process.env.INSTANCE}`, {
        number: number,
        textMessage: {
          text: message,
        },
      });
    }

    if (updatedSchedule.providerId === null) {
      return res.status(404).json({ message: "Prestador não encontrado" });
    }

    const provider = await prisma.user.findUnique({
      where: { id: updatedSchedule.providerId },
    });

    if (!provider || provider.fone === null) {
      return res.status(400).json({ error: "Invalid provider ID" });
    }

    if (provider.notification === "A") {
      const number = `55${provider.fone.replace(/[^0-9]/g, "")}`;
      const today = new Date();
      const message =
        `Olá ${provider.name}, o serviço foi cancelado.\n\n` +
        `⛏️ Serviço: ${updatedSchedule?.title}\n` +
        `📅 Data: ${formatDatePtBr(String(today))}\n` +
        `🕝 Hora: ${today.getHours()}:${today.getMinutes()}\n\n` +
        `Acesse o site e confira mais detalhes.`;

      await api_notify.post(`/${process.env.INSTANCE}`, {
        number: number,
        textMessage: {
          text: message,
        },
      });
    }

    return res.status(200).json(updatedSchedule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid status value" });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to update schedule status" });
    }
  }
});

router.delete(
  "/delete/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await prisma.schedule.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar agendamento" });
    }
  }
);

export default router;
