import { Address } from "./Address";
import { Schedule } from "./Schedule";

export interface User {
  id: number;
  name: string;
  email: string;
  fone: string;
  password?: string; // password might not be set for users authenticated via Google
  googleId?: string;
  role: "USER" | "ADMIN" | "PRESTADOR";
  createdAt: Date;
  updatedAt: Date;
  schedules?: Schedule[];
  addresses?: Address[];
  notification: string;
}
