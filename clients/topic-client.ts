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

  async GetTopics(): Promise<ITopic[]> {
    console.log("Making request");
    let result = await fetch(`/api/GetTopics`);
    let result2 = await fetch(`/api/GetTopicsById?topicId=123123`);
    console.log("Returned from request");
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
