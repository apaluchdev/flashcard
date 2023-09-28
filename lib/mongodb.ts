import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";
import mongoose from "mongoose";

let initialized: boolean = false;

async function GetOldFlashcards() {
  const response = await fetch(`http://localhost:5000/flashcards`);
  const result = await response.json();
  console.log(result.flashcards.length);

  let flashcardsOld = result.flashcards;
  console.log(flashcardsOld.length);
  // result.flashcards.forEach(function (card: any) {
  //   console.log(card);
  // });
  let flashcards: any[] = flashcardsOld.map((obj: any) => ({
    question: obj.question,
    answer: obj.answer,
    userId: "Adrian",
    topicId: undefined,
    topicTitle: obj.topic,
  }));

  // await saveThing();
  // async function saveThing() {
  //   try {
  //     // Use a forEach loop to save each Topic object
  //     for (const flashcard of flashcards) {
  //       const card = new Flashcard(flashcard);
  //       let topic = await Topic.find({ topicTitle: flashcard.topicTitle });
  //       if (topic.length == 0) continue;
  //       card.topicId = topic[0]._id;
  //       card.answer = `<p>${card.answer}</p>`
  //       await card.save();
  //       console.log(`Saved: ${card.question}`);
  //     }
  //   } catch (err) {
  //     console.error(`Error`, err);
  //   }
  // }
}

export default function InitializeMongoose() {
  if (initialized) return;

  console.log("Mongoose initializing...");

  const MONGODB_URI =
    process.env.MONGODB_KEY || "mongodb://localhost:27017/my-mongo-db"; // Replace with your MongoDB connection string

  mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log("Mongoose connected"))
    .catch((error) => console.log("Mongoose error: " + error));

  initialized = true;

  //GetOldFlashcards();
}
