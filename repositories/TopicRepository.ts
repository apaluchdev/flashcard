import { ITopic } from "@/models/Topic";
import { ITopicRepository } from "./interfaces/ITopicRepository";

class TopicRepository implements ITopicRepository {
  async getById(id: number): Promise<ITopic | null> {
    return null;
  }

  async getAll(): Promise<ITopic[]> {
    return [];
  }

  async add(Topic: ITopic): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(Topic: ITopic): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
