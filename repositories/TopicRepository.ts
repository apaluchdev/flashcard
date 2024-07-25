import Topic, { ITopic } from "@/models/Topic";
import { ITopicRepository } from "./interfaces/ITopicRepository";
import connect from "@/lib/mongoose-connect";

export class TopicRepository implements ITopicRepository {
  constructor() {
    connect();
  }

  async getById(id: string): Promise<ITopic | null> {
    const topics = await Topic.find({ _id: id });

    if (topics.length > 1) {
      return null;
    }

    return topics[0];
  }

  async getByUserId(userId: string): Promise<ITopic[]> {
    return await Topic.find({ userId: userId });
  }

  async getAll(): Promise<ITopic[]> {
    return await Topic.find({});
  }

  async add(Topic: ITopic): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(Topic: ITopic): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
