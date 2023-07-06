import { NextRequest, NextResponse } from "next/server";
import Flashcard from "@/types/Flashcard";
import flashcardClient from "@/lib/FlashcardClient";

// CREATE
export async function POST(req: any) {
  try {
    const body = await req.json();

    let flashcard: Flashcard = {
      id: "",
      question: body.question,
      answer: body.answer,
      topicId: body.topicId || "123-456-789",
      userId: body.userId || "",
      topic:
        body.topic ||
        (await flashcardClient.getTopicByTopicId(body.topicId)) ||
        "Placeholder topic",
      order: 0,
    };

    let createdCard = await flashcardClient.createItem(flashcard);

    return NextResponse.json({ createdCard });
  } catch (error) {
    console.log("Error adding flashcard: " + error);
  }
}

// READ
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");
  const userId = searchParams.get("userId");

  if (!userId || !topicId) return;

  try {
    let cards = await flashcardClient.getFlashcardsByUserIdAndTopicId(
      userId,
      topicId
    );

    return NextResponse.json({ cards });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return;

    await flashcardClient.deleteItemById(id);

    return NextResponse.json({ msg: "Deleted Flashcard" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error deleting flashcard" },
      { status: 500 }
    );
  }
}
