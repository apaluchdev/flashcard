import { ITopic } from "@/models/Topic";

export interface ITopicRepository {
  getById(id: string): Promise<ITopic | null>;
  getAll(): Promise<ITopic[]>;
  add(Topic: ITopic): Promise<void>;
  update(Topic: ITopic): Promise<void>;
  delete(id: string): Promise<void>;
}
