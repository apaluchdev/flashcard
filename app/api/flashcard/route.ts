import connect from "@/lib/mongoose-connect";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { FlashcardRepository } from "@/repositories/FlashcardRepository";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

const flashcardRepository = new FlashcardRepository();

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);

    var flashcards: IFlashcard[] = [];

    if (searchParams.has("topicId"))
      flashcards = await flashcardRepository.getByTopicId(
        searchParams.get("topicId") as string,
      );
    else flashcards = await Flashcard.find({});

    return NextResponse.json({ flashcards }, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.log(`Error in API GET for flashcards ${error}`);

    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    connect();

    const flashcard: IFlashcard = await req.json();

    var existingFlashcard: IFlashcard | null = null;

    if (flashcard._id) {
      existingFlashcard = await flashcardRepository.getById(flashcard._id);
    }

    if (existingFlashcard) {
      const updatedFlashcard = await flashcardRepository.update(flashcard);
      return NextResponse.json(
        { flashcard: updatedFlashcard },
        { status: HttpStatusCode.Created },
      );
    } else {
      const insertedFlashcard = await flashcardRepository.insert(flashcard);
      return NextResponse.json(
        { flashcard: insertedFlashcard },
        { status: HttpStatusCode.Created },
      );
    }
  } catch (error) {
    console.log(`Error in API POST for topic ${error}`);

    return NextResponse.json(
      { msg: "Error inserting topic" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
