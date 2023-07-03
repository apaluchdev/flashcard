export default interface Flashcard {
  id: string;
  question: string;
  answer: string;
  userId: string;
  topicId: string;
  topic: string;
  order: number;
}
