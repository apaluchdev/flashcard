import { IUser } from "@/models/User";

export interface IUserRepository {
  getById(id: number): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  insert(user: IUser): Promise<void>;
  update(user: IUser): Promise<void>;
  delete(id: number): Promise<void>;
}
