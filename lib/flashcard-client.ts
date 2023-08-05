import { IFlashcard } from "@/models/Flashcard";

const flashcardClient = {
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
};

export default flashcardClient;
