import { prisma } from "../libs/prisma";
import express, { Request, Response, Router } from "express";
import { z } from "zod";
import { uploadMiddleware, deleteImage } from "../utils/upload";
import {
  AuthenticatedRequest,
  authenticateToken,
} from "./middlewares/authenticateToken";

const router: Router = express.Router();

export const createServiceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  image: z.string().url("URL da imagem inválida").optional(),
  categoryId: z.preprocess(
    (val) => Number(val),
    z.number().int().positive("ID da categoria é obrigatório")
  ),
});

export const updateServiceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  description: z.string().optional(),
  image: z.string().url("URL da imagem inválida").optional(),
  categoryId: z.preprocess(
    (val) => Number(val),
    z.number().int().positive("ID da categoria é obrigatório")
  ),
});

const createCategorySchema = z.object({
  name: z.string().nonempty("Nome da categoria é obrigatório"),
});

router.get("/list", async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

router.post(
  "/register",
  authenticateToken,
  uploadMiddleware,
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
          .json({ error: "Apenas administradores podem criar serviços" });
      }

      const validation = createServiceSchema.safeParse(req.body);
      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const { name, description, categoryId } = validation.data;
      const image = req.file?.filename;

      if (!image) {
        return res.status(400).json({ error: "Imagem obrigatória" });
      }

      const service = await prisma.service.create({
        data: {
          name,
          description,
          image,
          categoryId,
        },
      });

      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar serviço" });
    }
  }
);

router.put(
  "/edit/:id",
  authenticateToken,
  uploadMiddleware,
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
          .json({ error: "Apenas administradores podem editar serviços" });
      }

      const validation = updateServiceSchema.safeParse(req.body);
      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const { id } = req.params;
      const updatedData = validation.data;
      const image = req.file?.filename;

      if (image) {
        const existingService = await prisma.service.findUnique({
          where: { id: Number(id) },
        });
        if (existingService?.image) {
          deleteImage(existingService.image);
        }
        updatedData.image = image;
      }

      const service = await prisma.service.update({
        where: { id: Number(id) },
        data: updatedData,
      });

      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar serviço" });
    }
  }
);

router.delete(
  "/delete/:id",
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
          .json({ error: "Apenas administradores podem deletar serviços" });
      }

      const { id } = req.params;

      const service = await prisma.service.findUnique({
        where: { id: Number(id) },
      });

      if (service?.image) {
        deleteImage(service.image);
      }

      await prisma.service.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar serviço" });
    }
  }
);

router.get("/listByCategory", async (req: Request, res: Response) => {
  try {
    const categoriesWithServices = await prisma.serviceCategory.findMany({
      include: {
        services: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(categoriesWithServices);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar serviços por categoria" });
  }
});

router.get(
  "/categories/list",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const categories = await prisma.serviceCategory.findMany({
        orderBy: {
          createdAt: "asc",
        },
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  }
);

router.post(
  "/categories/register",
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
          .json({ error: "Apenas administradores podem criar categorias" });
      }

      const validation = createCategorySchema.safeParse(req.body);
      if (!validation.success) {
        return res
          .status(400)
          .json({ error: validation.error.errors[0].message });
      }

      const { name } = validation.data;

      const category = await prisma.serviceCategory.create({
        data: {
          name,
        },
      });

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  }
);

router.put(
  "/categories/edit/:id",
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
          .json({ error: "Apenas administradores podem editar categorias" });
      }

      const { id } = req.params;
      const { name } = req.body;

      const updatedCategory = await prisma.serviceCategory.update({
        where: { id: Number(id) },
        data: {
          name,
        },
      });

      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  }
);

router.delete(
  "/categories/delete/:id",
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
          .json({ error: "Apenas administradores podem deletar categorias" });
      }

      const { id } = req.params;

      await prisma.service.deleteMany({
        where: { categoryId: Number(id) },
      });

      await prisma.serviceCategory.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar categoria" });
    }
  }
);

export default router;
