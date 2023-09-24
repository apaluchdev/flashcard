import Flashcard from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";
import { NextRequest, NextResponse } from "next/server";

// READ
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const topicTitle = searchParams.get("topicTitle");

    if (!userId || !topicTitle) throw new Error("Invalid request");

    return await GetFlashcardsByUserIdAndTopicTitle(userId, topicTitle);
  } catch {
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 400 },
    );
  }
}

async function GetFlashcardsByUserIdAndTopicTitle(
  userId: string,
  topicTitle: string,
) {
  const topic: ITopic | null = await Topic.findOne({
    userId: userId,
    topicTitle: topicTitle,
  });
  if (!topic) throw new Error("Could not find topic");
  const flashcards = await Flashcard.find({ topicId: topic._id });
  flashcards.sort((a: any, b: any) => (a.createdAt > b.createdAt ? -1 : 1));
  return NextResponse.json({ flashcards }, { status: 200 });
}
