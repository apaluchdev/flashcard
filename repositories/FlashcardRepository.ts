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

  async insert(flashcard: IFlashcard): Promise<IFlashcard | null> {
    const insertedFlashcard = await Flashcard.create(flashcard);
    return insertedFlashcard;
  }

  async update(flashcard: IFlashcard): Promise<IFlashcard | null> {
    if (!flashcard._id) return null;

    await Flashcard.findByIdAndUpdate(flashcard._id, flashcard);
    return this.getById(flashcard._id);
  }

  async delete(id: string): Promise<void> {
    await Flashcard.deleteOne({ _id: id });
  }
}
