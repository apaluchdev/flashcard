import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

export interface IFlashcard {
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
