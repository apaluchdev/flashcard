"use client";

import { IFlashcard } from "@/models/Flashcard";

const flashcardClient = {
  async UpsertFlashcard(
    flashcard: IFlashcard,
  ): Promise<IFlashcard | undefined> {
    const response = await fetch(`/api/UpsertFlashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flashcard),
    });
    const resultJson = await response.json();
    return resultJson.savedFlashcard;
  },

  async GetFlashcardsByUserIdAndTopicTitleAsync(
    userId: string,
    topicTitle: string,
  ): Promise<IFlashcard[]> {
    const response = await fetch(`/api/GetFlashcardsByUserIdAndTopicTitle`);
    const resultJson = await response.json();
    return resultJson.flashcards;
  },

  async DeleteFlashcardById(id: string): Promise<boolean> {
    const response = await fetch(`/api/DeleteFlashcardById?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status === 200;
  },
};

export default flashcardClient;
