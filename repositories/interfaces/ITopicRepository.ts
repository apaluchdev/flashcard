import { ITopic } from "@/models/Topic";

export interface ITopicRepository {
  getById(id: number): Promise<ITopic | null>;
  getAll(): Promise<ITopic[]>;
  add(Topic: ITopic): Promise<void>;
  update(Topic: ITopic): Promise<void>;
  delete(id: number): Promise<void>;
}
