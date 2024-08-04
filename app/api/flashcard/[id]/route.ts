import connect from "@/lib/mongoose-connect";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { FlashcardRepository } from "@/repositories/FlashcardRepository";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const flashcardRepository = new FlashcardRepository();

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    await connect();

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { msg: "Id required" },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const flashcardToDelete = await flashcardRepository.getById(id);

    if (!flashcardToDelete) {
      return NextResponse.json(
        {
          msg: "Flashcard not found",
        },
        { status: HttpStatusCode.NotFound },
      );
    }
    if (flashcardToDelete.userId !== session.user.id) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized },
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
