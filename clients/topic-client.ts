import { ITopic } from "@/models/Topic";

const topicClient = {
  async UpsertTopic(topic: ITopic): Promise<ITopic> {
    const result = await fetch(`/api/UpsertTopic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topic),
    });
    const resultJson = await result.json();
    return resultJson.savedTopic;
  },

  async GetTopics(topicSearch: string = ""): Promise<ITopic[]> {
    let result = await fetch(`/api/GetTopics?topicSearch=${topicSearch}`);
    const resultJson = await result.json();
    return resultJson.topics;
  },

  async GetTopicByUserIdAndTopicTitle(
    userId: string,
    topicTitle: string,
  ): Promise<ITopic | null> {
    const result = await fetch(
      `/api/GetTopicByUserIdAndTopicTitle?userId=${userId}&topicTitle=${topicTitle}`,
    );
    const resultJson = await result.json();
    return resultJson.topic;
  },
};

export default topicClient;
