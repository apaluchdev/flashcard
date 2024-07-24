import { IFlashcard } from "@/models/Flashcard";

export interface IFlashcardRepository {
  getById(id: number): Promise<IFlashcard | null>;
  getAll(): Promise<IFlashcard[]>;
  add(Flashcard: IFlashcard): Promise<void>;
  update(Flashcard: IFlashcard): Promise<void>;
  delete(id: number): Promise<void>;
}
