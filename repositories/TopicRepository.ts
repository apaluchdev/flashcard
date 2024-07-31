import Topic, { ITopic } from "@/models/Topic";
import { ITopicRepository } from "./interfaces/ITopicRepository";
import connect from "@/lib/mongoose-connect";

export class TopicRepository implements ITopicRepository {
  constructor() {
    connect();
  }

  async getById(id: string): Promise<ITopic | null> {
    const topic = await Topic.findById(id);
    return topic;
  }

  async getByUserId(userId: string): Promise<ITopic[]> {
    return await Topic.find({ userId: userId });
  }

  async getAll(): Promise<ITopic[]> {
    return await Topic.find({});
  }

  async insert(topic: ITopic): Promise<ITopic> {
    return await Topic.create(topic);
  }

  async update(topic: ITopic): Promise<ITopic | null> {
    return await Topic.findByIdAndUpdate(topic._id, topic);
  }

  async delete(id: string): Promise<void> {
    await Topic.findByIdAndDelete(id);
  }
}
