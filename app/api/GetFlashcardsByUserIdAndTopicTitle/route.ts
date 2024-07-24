import connect from "@/lib/mongoose-connect";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { ITopic } from "@/models/Topic";
import { NextRequest, NextResponse } from "next/server";

// READ
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const topicTitle = searchParams.get("topicTitle");

    console.log("Getting flashcards!");
    if (!userId || !topicTitle) {
      return NextResponse.json(
        { msg: "userId and topicTitle required" },
        { status: 400 },
      );
    }

    const flashcards = await GetFlashcardsByUserIdAndTopicTitleAsync(
      userId,
      topicTitle,
    );
    return NextResponse.json({ flashcards }, { status: 200 });
  } catch {
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 400 },
    );
  }
}

async function GetFlashcardsByUserIdAndTopicTitleAsync(
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
  return flashcards as IFlashcard[];
}
