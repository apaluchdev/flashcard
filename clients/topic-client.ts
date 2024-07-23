"use client";

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
    let result = await fetch(`/api/GetTopics`, { next: { revalidate: 60 } });
    const resultJson = await result.json();
    return resultJson.topics;
  },

  async GetTopicByUserIdAndTopicTitle(
    userId: string,
    topicTitle: string,
  ): Promise<ITopic | null> {
    const urlToFetch = `/api/GetTopicByUserIdAndTopicTitle?userId=${userId}&topicTitle=${topicTitle}`;
    console.log("Fetching from " + urlToFetch);
    const result = await fetch(urlToFetch);
    const resultJson = await result.json();
    return resultJson.topic;
  },
};

export default topicClient;
