import { Address } from "./Address";
import { Service } from "./Service";
import { User } from "./User";

export interface Schedule {
  id: number;
  userId: number;
  user: User;
  serviceId: number;
  service: Service;
  title: string;
  description?: string;
  date: Date;
  time: string;
  providerId?: number;
  provider?: User;
  status:
    | "A_CONFIRMAR"
    | "AGENDADO"
    | "EM_ANDAMENTO"
    | "CONCLUIDO"
    | "CANCELADO"
    | "PAUSADO";
  addressId: number;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}
