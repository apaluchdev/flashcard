import flashcardClient from "@/app/FlashcardClient";
import { NextRequest, NextResponse } from "next/server";

// Endpoint to delete flashcards
export async function DELETE(req: NextRequest) {
  try {
    const apiPath = await req.nextUrl.pathname;
    const itemId = apiPath.substring(apiPath.lastIndexOf("/") + 1);
    console.log(`Deleting ${itemId}`);
    await flashcardClient.deleteItem(itemId);

    return NextResponse.json({ msg: "Deleted Flashcard" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error deleting flashcard" },
      { status: 500 }
    );
  }
}
