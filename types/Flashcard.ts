import { ObjectId } from "mongodb";

export default interface Flashcard {
  _id: ObjectId;
  question: string;
  answer: string;
  userId: string;
  topicId: string;
  topic: string;
  order: number;
}
