import { IFlashcard } from "@/models/Flashcard";
import { IFlashcardRepository } from "./interfaces/IFlashcardRepository";

class FlashcardRepository implements IFlashcardRepository {
  async getById(id: number): Promise<IFlashcard | null> {
    return null;
  }

  async getAll(): Promise<IFlashcard[]> {
    return [];
  }

  async add(Flashcard: IFlashcard): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(Flashcard: IFlashcard): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
