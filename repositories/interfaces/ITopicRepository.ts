import { ITopic } from "@/models/Topic";

export interface ITopicRepository {
  getById(id: string): Promise<ITopic | null>;
  getAll(): Promise<ITopic[]>;
  insert(Topic: ITopic): Promise<ITopic>;
  update(Topic: ITopic): Promise<ITopic | null>;
  delete(id: string): Promise<void>;
}
