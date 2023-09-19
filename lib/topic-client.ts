import { IFlashcard } from "@/models/Flashcard";
import { ITopic } from "@/models/Topic";

const topicClient = {
  async AddTopic(title: string): Promise<boolean> {
    const response = await fetch(`/api/flashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topicTitle: title }),
    });

    return response.status == 200;
  },

  async UpdateTopicTitle(
    newTopicName: string,
    topicId: string,
  ): Promise<boolean> {
    const response = await fetch(`/api/flashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newTopicName: newTopicName, topicId: topicId }),
    });

    return response.status == 200;
  },

  async GetTopicTitle(topicId: string): Promise<string> {
    let title: string = "";

    await fetch(`/api/flashcard?topicId=${topicId}&getTitle=Y`)
      .then((res) => res.json())
      .catch((err) => {
        return title;
      })
      .then((res) => {
        title = res.title;
      });

    return title;
  },

  async GetTopics(topicSearch: string | null = null): Promise<IFlashcard[]> {
    let cards: IFlashcard[] = [];

    await fetch(`/api/flashcard?topicSearch=${topicSearch}`)
      .then((res) => res.json())
      .then((res) => {
        cards = res.results;
      });

    return cards;
  },

  async GetTopicByUserIdAndTopic(
    userId: string,
    topic: string,
  ): Promise<ITopic | null> {
    let topicResult: ITopic | null = null;
    await fetch(`/api/topics?userId=${userId}&topic=${topic}`)
      .then((res) => res.json())
      .catch((err) => {
        return topicResult;
      })
      .then((res) => {
        topicResult = res.topicResult;
      });

    return topicResult;
  },
};

export default topicClient;
