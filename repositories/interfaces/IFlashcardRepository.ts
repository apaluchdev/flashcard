import { IFlashcard } from "@/models/Flashcard";

export interface IFlashcardRepository {
  getById(id: string): Promise<IFlashcard | null>;
  getAll(): Promise<IFlashcard[]>;
  insert(Flashcard: IFlashcard): Promise<IFlashcard | null>;
  update(Flashcard: IFlashcard): Promise<IFlashcard | null>;
  delete(id: string): Promise<void>;
}
