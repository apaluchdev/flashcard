import connect from "@/lib/mongoose-connect";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { FlashcardRepository } from "@/repositories/FlashcardRepository";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

const flashcardRepository = new FlashcardRepository();

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    await connect();

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { msg: "Id required" },
        { status: HttpStatusCode.BadRequest },
      );
    }

    await flashcardRepository.delete(id);

    return NextResponse.json(
      { msg: `Deleted Flashcard with id: ${id}` },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.log(`Error in API DELETE for flashcards ${error}`);

    return NextResponse.json(
      { msg: "Error deleting flashcard" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
