import { Schedule } from "./Schedule";

export interface Service {
  id: number;
  name: string;
  description?: string;
  image: string;
  categoryId: number;
  category: ServiceCategory;
  schedules?: Schedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: number;
  name: string;
  services?: Service[];
  createdAt: Date;
  updatedAt: Date;
}
