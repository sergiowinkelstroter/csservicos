import { User } from "./User";

export interface Address {
  id: number;
  userId: number;
  user: User;
  street: string;
  number: number;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}
