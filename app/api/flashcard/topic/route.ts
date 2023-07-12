import { NextResponse, NextRequest } from "next/server";
import flashcardClient from "@/lib/FlashcardClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  if (!topicId) return;

  // Returning a list of all topic requests
  if (topicId === "all") {
    const topics = await flashcardClient.getAllTopics();
    return NextResponse.json({ topics });
  } else {
    // Or find an individual topic via topic id
    try {
      let topic = await flashcardClient.getTopicByTopicId(topicId);
      return NextResponse.json({ topic });
    } catch (error) {
      console.error("Error fetching flashcards", error);
      return NextResponse.json({ msg: "Error fetching flashcards" });
    }
  }
}
