import express, { Application, Request, Response, NextFunction } from "express";
import router_users from "./routes/users";
import router_services from "./routes/services";
import router_schedules from "./routes/schedules";
import router_adresses from "./routes/adresses";
import router_home from "./routes/home";
import router_login from "./routes/login";
import router_backups from "./routes/backups";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4002;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - Status: ${res.statusCode} - Tempo: ${duration}ms`
    );
  });

  next();
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/users", router_users);
app.use("/services", router_services);
app.use("/schedules", router_schedules);
app.use("/adresses", router_adresses);
app.use("/auth", router_login);
app.use("/home", router_home);
app.use("/backups", router_backups);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
