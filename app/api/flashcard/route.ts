import connect from "@/lib/mongoose-connect";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { FlashcardRepository } from "@/repositories/FlashcardRepository";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { TopicRepository } from "@/repositories/TopicRepository";
import { authOptions } from "@/lib/auth";

const flashcardRepository = new FlashcardRepository();
const topicRepository = new TopicRepository();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized },
      );
    }
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized },
      );
    }
    connect();

    const flashcard: IFlashcard = await req.json();

    if (!flashcard.topicId) {
      return NextResponse.json(
        { msg: "TopicId required" },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const topic = await topicRepository.getById(flashcard?.topicId);

    if (!topic) {
      return NextResponse.json(
        { msg: "Topic for flashcard not found" },
        { status: HttpStatusCode.NotFound },
      );
    }

    if (topic.userId !== session.user.id) {
      return NextResponse.json(
        { msg: "Unauthorized to add flashcards to this deck" },
        { status: HttpStatusCode.Unauthorized },
      );
    }

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
