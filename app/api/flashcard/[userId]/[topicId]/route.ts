import { NextResponse, NextRequest } from "next/server";
import Flashcard from "@/types/Flashcard";
import flashcardClient from "@/app/FlashcardClient";

// Must be a better way to retrieve dynamic parameters, TODO search through documenation some more later.
export async function GET(req: NextRequest) {
  let path = await req.nextUrl.pathname;
  const substrings = path.split("/");

  console.log(substrings);

  try {
    let cards = await flashcardClient.getFlashcardsByUserIdAndTopicId(
      substrings[substrings.length - 2],
      substrings[substrings.length - 1]
    );
    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Error fetching flashcards", error);
    return NextResponse.json({ msg: "Error fetching flashcards" });
  }
}
