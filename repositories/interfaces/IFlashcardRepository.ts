import { IFlashcard } from "@/models/Flashcard";

export interface IFlashcardRepository {
  getById(id: string): Promise<IFlashcard | null>;
  getAll(): Promise<IFlashcard[]>;
  add(Flashcard: IFlashcard): Promise<void>;
  update(Flashcard: IFlashcard): Promise<void>;
  delete(id: string): Promise<void>;
}
