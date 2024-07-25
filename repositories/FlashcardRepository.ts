import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { IFlashcardRepository } from "./interfaces/IFlashcardRepository";

export class FlashcardRepository implements IFlashcardRepository {
  async getById(id: string): Promise<IFlashcard | null> {
    const flashcards = await Flashcard.find({ _id: id });

    if (flashcards.length > 1) {
      return null;
    }

    return flashcards[0];
  }

  async getByTopicId(topicId: string): Promise<IFlashcard[]> {
    return await Flashcard.find({ topicId: topicId });
  }

  async getAll(): Promise<IFlashcard[]> {
    return await Flashcard.find({});
  }

  async add(Flashcard: IFlashcard): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(Flashcard: IFlashcard): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    await Flashcard.deleteOne({ _id: id });
  }
}
