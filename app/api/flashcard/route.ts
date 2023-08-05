import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import InitializeMongoose from "@/lib/mongodb";
import { randomUUID } from "crypto";

InitializeMongoose();

// CREATE
export async function POST(req: any) {
  try {
    const body = await req.json();

    const flashcard = new Flashcard({
      _id: body._id,
      question: body.question,
      answer: body.answer,
      topicId: body.topicId || randomUUID().toString(),
      userId: body.userId || randomUUID().toString(),
      topic: body.topic, // If topicId and userId is filled - try getting the title
      order: body.order,
    });

    const savedFlashcard: IFlashcard = await flashcard.save();

    return NextResponse.json({ savedFlashcard });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error inserting flashcard" },
      { status: 500 }
    );
  }
}

// READ
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const topicId = searchParams.get("topicId");
  const getTitle = searchParams.get("getTitle");

  // No topicId given, just return all topics
  if (!topicId) return await GetTopics();

  // Just topicId given, return topic title
  if (topicId && getTitle == "Y") return await GetTitle(topicId);

  // Both parameters, return all flashcards for the given topicId and userId
  if (topicId) return await GetFlashcards(topicId);
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return;

    await Flashcard.deleteOne({ _id: id });

    return NextResponse.json(
      { msg: `Deleted Flashcard with id: ${id}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Error deleting flashcard" },
      { status: 500 }
    );
  }
}

async function GetFlashcards(topicId: string) {
  try {
    const flashcards = await Flashcard.find({ topicId: topicId });
    return NextResponse.json({ flashcards }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 500 }
    );
  }
}

async function GetTitle(topicId: string) {
  try {
    const result: IFlashcard =
      (await Flashcard.findOne({ topicId: topicId })) || new Flashcard();

    return NextResponse.json({ title: result?.topic ?? "" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching title" }, { status: 500 });
  }
}

async function GetTopics() {
  try {
    const pipeline = [
      {
        $group: {
          _id: { topicId: "$topicId", userId: "$userId" },
          firstDocument: { $first: "$$ROOT" }, // $$ROOT represents the entire document
        },
      },
      {
        $replaceRoot: { newRoot: "$firstDocument" }, // Promote the grouped document to the root
      },
    ];

    const results = await Flashcard.aggregate(pipeline, {});

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topics" }, { status: 500 });
  }
}
