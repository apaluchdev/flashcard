import { NextRequest, NextResponse } from "next/server";
import Topic, { ITopic } from "@/models/Topic";
import Flashcard from "@/models/Flashcard";

// READ
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const flashcards = await Flashcard.find();

    return NextResponse.json({ flashcards }, { status: 200 });
  } catch (error) {
    console.log(`Error in API GET for flashcards ${error}`);
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 500 },
    );
  }
}
