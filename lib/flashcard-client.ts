import { IFlashcard } from "@/models/Flashcard";

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

  async SaveFlashcard(card: IFlashcard) {
    // Save request
    const response = await fetch(`/api/flashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });

    if (response.status !== 200) {
      return "Error: " + response;
    }

    return (await response.json()).savedFlashcard;
  },

  async RenameTopic(newTopicName: string, topicId: string) {
    // Save request
    const response = await fetch(`/api/flashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newTopicName: newTopicName, topicId: topicId }),
    });

    if (response.status !== 200) {
      return "Error: " + response;
    }

    return (await response.json()).savedFlashcard;
  },

  async GetFlashcards(userId: string, topicId: string): Promise<IFlashcard[]> {
    let cards: IFlashcard[] = [];
    await fetch(`/api/flashcard?userId=${userId}&topicId=${topicId}`)
      .then((res) => res.json())
      .then((res) => {
        cards = res.flashcards;
      });
    return cards;
  },

  async GetTitle(topicId: string): Promise<string> {
    let title: string = "Title not found";
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

    if (response.status === 200) {
      return true;
    }

    return false;
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
};

export default flashcardClient;
