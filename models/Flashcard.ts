import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

export interface IFlashcard extends Document {
  _id?: string;
  question: string;
  answer: string;
  userId?: string;
  topicId?: string;
  topic?: string;
  order?: number;
}

const flashcardSchema = new Schema<IFlashcard>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Flashcard: Model<IFlashcard> =
  mongoose.models?.Flashcard ||
  mongoose.model<IFlashcard>("Flashcard", flashcardSchema);

export default Flashcard;

export function shuffleFlashcards(cards: IFlashcard[]): IFlashcard[] {
  if (!cards || cards.length < 2) return cards;
  let shuffledCards = cards.concat([]);

  // Keep shuffling if the first card doesn't change, otherwise users will think nothing happened.
  while (cards[0] == shuffledCards[0]) {
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ]; // Swap elements at indices i and j
    }
  }

  return shuffledCards;
  // router.push(`?cardIndex=${0}`, {
  //   scroll: false,
  // });
}
