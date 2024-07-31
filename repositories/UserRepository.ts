import { IUserRepository } from "./interfaces/IUserRepository";
import { IUser } from "@/models/User";

class UserRepository implements IUserRepository {
  async getById(id: number): Promise<IUser | null> {
    return null;
  }

  async getAll(): Promise<IUser[]> {
    return [];
  }

  async insert(user: IUser): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(user: IUser): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
