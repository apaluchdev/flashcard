import { NextRequest, NextResponse } from "next/server";
import { ChatGPTAPI } from "chatgpt";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { randomUUID } from "crypto";

// READ
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const topic = searchParams.get("topic") || "Bash Shell";
    const difficulty = searchParams.get("difficulty");
    const numQuestions = Math.min(
      parseInt(searchParams.get("numQuestions") || "20"),
      50,
    );

    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
    const res = await api.sendMessage(
      `Give me a list of ${numQuestions} numbered questions with answers that can be used to quiz someone on the topic of '${topic}'`,
    );

    let response = res.text;

    // Any number followed by a period
    const regex = /\d+\./;

    // Use the `search` method to find the index of the pattern
    const matchIndex = response.search(regex);

    response = response.slice(matchIndex);

    let questionAnswerPair = response.split("\n\n");

    let flashcards: IFlashcard[] = [];

    let gentopicId = `${topic ?? ""}-${randomUUID().toString().split("-")[0]}`;
    let genUserId = randomUUID().toString().split("-")[0];

    // Create all the cards using the chatGPT response
    for (const qa of questionAnswerPair) {
      let questionAndAnswer = qa.split("\n");
      // Remove the #._
      let question = questionAndAnswer[0].slice(
        questionAndAnswer[0].indexOf(" ") + 1,
      );
      let answer = questionAndAnswer[1];

      let flashcard = new Flashcard({
        question: question,
        answer: answer,
        topic: topic,
        topicId: gentopicId, // Generate an id using a combination of the topic and a portion of a UUID
        userId: genUserId, // TODO - use authenticated user ids
      });

      flashcards.push(flashcard);
    }

    Flashcard.insertMany(flashcards);

    return NextResponse.json(
      { topicId: gentopicId, userId: genUserId, res },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Error generating cards" },
      { status: 500 },
    );
  }
}
