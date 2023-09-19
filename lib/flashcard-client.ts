import { IFlashcard } from "@/models/Flashcard";
import { ITopic } from "@/models/Topic";
import topicClient from "./topic-client";

const flashcardClient = {
  async GenerateDeck(topic: string, difficulty: string): Promise<any> {
    let response = {};
    await fetch(`/api/chatGPT?topic=${topic}&difficulty=${difficulty}`) // TODO make difficulty an enum
      .then((res) => res.json())
      .then((res) => {
        response = { topicId: res.topicId, userId: res.userId };
      });
    return response;
  },

  async AddTopicAsync(topic: ITopic): Promise<ITopic | undefined> {
    const response = await fetch(`/api/topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topic),
    });

    if (response.status !== 200) return undefined;

    return (await response.json()).savedTopic;
  },

  async SaveFlashcard(card: IFlashcard): Promise<IFlashcard | undefined> {
    const response = await fetch(`/api/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });

    if (response.status !== 200) return undefined;

    return (await response.json()).savedFlashcard;
  },

  async RenameTopic(newTopicName: string, topicId: string): Promise<boolean> {
    const response = await fetch(`/api/flashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newTopicName: newTopicName, topicId: topicId }),
    });

    return response.status == 200;
  },

  async GetFlashcardsByUserIdAndTopicAsync(
    userId: string,
    topic: string,
  ): Promise<IFlashcard[]> {
    let cards: IFlashcard[] = [];

    const topicResult: ITopic | null =
      await topicClient.GetTopicByUserIdAndTopic(userId, topic);
    if (!topicResult) return [];

    await fetch(`/api/flashcards?topicId=${topicResult?._id}`)
      .then((res) => res.json())
      .then((res) => {
        cards = res.flashcards;
      });
    return cards;
  },

  async GetTitle(topicId: string): Promise<string> {
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

  async DeleteCard(id: string): Promise<boolean> {
    const response = await fetch(`/api/flashcard?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.status === 200;
  },
};

export default flashcardClient;
