import { NextResponse, NextRequest } from "next/server";
import flashcardClient from "@/app/FlashcardClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  if (!topicId) return;

  try {
    let topic = await flashcardClient.getTopicByTopicId(topicId);
    return NextResponse.json({ topic });
  } catch (error) {
    console.error("Error fetching flashcards", error);
    return NextResponse.json({ msg: "Error fetching flashcards" });
  }
}
