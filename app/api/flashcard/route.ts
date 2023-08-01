import { NextRequest, NextResponse } from "next/server";
import Flashcard from "@/types/Flashcard";
import connectToDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";
// CREATE
export async function POST(req: any) {
  try {
    const body = await req.json();

    let flashcard: Flashcard = {
      question: body.question,
      answer: body.answer,
      topicId: body.topicId || "123-456-789",
      userId: body.userId || "",
      topic:
        body.topic ||
        (await GetTitle(body.topicId)).json().then((res) => res.title) ||
        "Placeholder topic",
      order: body.order || 0,
    };

    const client = await connectToDatabase();
    let flashcardCollection = client.db("flashcard").collection("flashcards");

    var result = await flashcardCollection.insertOne(flashcard);
    return NextResponse.json({ result });
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

    const client = await connectToDatabase();
    let flashcardCollection = client.db("flashcard").collection("flashcards");

    let objId = new ObjectId(id);

    const query = { _id: objId };
    await flashcardCollection.deleteOne(query);

    return NextResponse.json({ msg: "Deleted Flashcard" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error deleting flashcard" },
      { status: 500 }
    );
  }
}

async function GetFlashcards(topicId: string) {
  try {
    const client = await connectToDatabase();
    let flashcardCollection = client.db("flashcard").collection("flashcards");

    const query = { topicId: topicId };
    const flashcards = await flashcardCollection.find(query).toArray();

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
    const client = await connectToDatabase();
    let flashcardCollection = client.db("flashcard").collection("flashcards");

    const query = { topicId: topicId };
    const flashcards = await flashcardCollection.findOne(query);

    return NextResponse.json(
      { title: flashcards?.topic ?? "" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching title" }, { status: 500 });
  }
}

async function GetTopics() {
  try {
    const client = await connectToDatabase();
    let flashcardCollection = client.db("flashcard").collection("flashcards");

    //const cursor = await flashcardCollection.distinct("topic");
    const pipeline = [
      {
        $group: {
          _id: { topicId: "$topicId", userId: "$userId" },
          firstResult: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$firstResult",
        },
      },
    ];

    const results = await flashcardCollection.aggregate(pipeline).toArray();

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topics" }, { status: 500 });
  }
}
