import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import InitializeMongoose from "@/lib/mongodb";
import { UUID, randomUUID } from "crypto";

InitializeMongoose();

// CREATE
export async function POST(req: any) {
  try {
    const body = await req.json();

    if (body.newTopicName && body.topicId) {
      RenameTopic(body.newTopicName, body.topicId);
      return NextResponse.json({
        result: `Renamed topic ${body.newTopicName}`,
      });
    }

    let flashcard = await Flashcard.findOne({ _id: body._id });

    // Existing card
    if (flashcard) {
      flashcard.question = body.question;
      flashcard.answer = body.answer;
      flashcard.topic = body.topic;
      flashcard.order = body.order;
      // Don't need to set topic id as this is just an edit, already set
    }
    // New card
    else {
      flashcard = new Flashcard({
        _id: body._id,
        question: body.question,
        answer: body.answer,
        topicId:
          body.topicId ||
          `${body.topic ?? ""}-${randomUUID().toString().split("-")[0]}`, // Generate an id using a combination of the topic and a portion of a UUID
        userId: body.userId || randomUUID().toString().split("-")[0], // TODO - use authenticated user ids
        topic: body.topic, // If topicId and userId is filled - try getting the title
        order: body.order,
      });
    }

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
    flashcards.sort((a: any, b: any) => (a.createdAt > b.createdAt ? -1 : 1));
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
          _id: { topicId: "$topicId" },
          firstDocument: { $first: "$$ROOT" }, // $$ROOT represents the entire document
        },
      },
      {
        $replaceRoot: { newRoot: "$firstDocument" }, // Promote the grouped document to the root
      },
    ];

    const results = await Flashcard.aggregate(pipeline);
    results.sort((a: any, b: any) => (a.topic > b.topic ? 1 : -1));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topics" }, { status: 500 });
  }
}

async function RenameTopic(newTopicName: string, topicId: string) {
  try {
    const flashcards = await Flashcard.find({ topicId: topicId });

    flashcards.forEach((obj) => (obj.topic = newTopicName));

    // Update each document and save
    flashcards.forEach((flashcard) => {
      flashcard.topic = newTopicName;
      flashcard.save();
    });

    return NextResponse.json({ newTopicName }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 500 }
    );
  }
}
