import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import InitializeMongoose from "@/lib/mongodb";
import { UUID, randomUUID } from "crypto";

InitializeMongoose();

// CREATE
export async function POST(req: any) {
  try {
    const body: IFlashcard = await req.json();

    ValidateCard(body);

    const flashcard =
      (await Flashcard.findOne({ _id: body._id })) || new Flashcard();

    flashcard.question = body.question;
    flashcard.answer = body.answer;
    flashcard.userId = body.userId;
    flashcard.topicId = body.topicId;
    flashcard.order = body.order;

    const savedFlashcard = await flashcard.save();

    return NextResponse.json({ savedFlashcard });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error inserting flashcard" },
      { status: 500 },
    );
  }
}

function ValidateCard(card: IFlashcard) {
  if (!card.question) throw new Error("Flashcard must have question filled.");
  if (!card.answer) throw new Error("Flashcard must have answer filled.");
  if (!card.topicId) throw new Error("Flashcard must have topicId filled.");
  if (!card.userId) throw new Error("Flashcard must have userId filled.");

  // TODO -  Perform a check that the user has a token and can actually save to this topic id
}

// READ
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const topicId = searchParams.get("topicId");
    if (!topicId) throw new Error("Invalid request");

    // const userId = searchParams.get("userId");
    // const topic = searchParams.get("topic");

    // if (!userId || !topic) throw new Error("Invalid request");

    // const topicId = await GetTopicIdByUserIdAndTopic(userId, topic);

    return await GetFlashcardsByTopicId(topicId);
  } catch {
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 400 },
    );
  }
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
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Error deleting flashcard" },
      { status: 500 },
    );
  }
}

async function GetFlashcardsByTopicId(topicId: string) {
  try {
    const flashcards = await Flashcard.find({ topicId: topicId });
    flashcards.sort((a: any, b: any) => (a.createdAt > b.createdAt ? -1 : 1));
    return NextResponse.json({ flashcards }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error fetching flashcards" },
      { status: 500 },
    );
  }
}

// async function GetTitle(topicId: string): Promise<NextResponse> {
//   try {
//     const result: IFlashcard =
//       (await Flashcard.findOne({ topicId: topicId })) || new Flashcard();

//     return NextResponse.json({ title: result?.topic ?? "" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ msg: "Error fetching title" }, { status: 500 });
//   }
// }

// async function GetTopics(topicSearch: string | null) {
//   try {
//     const pipeline = [
//       {
//         $group: {
//           _id: { topicId: "$topicId" },
//           firstDocument: { $first: "$$ROOT" }, // $$ROOT represents the entire document
//         },
//       },
//       {
//         $replaceRoot: { newRoot: "$firstDocument" }, // Promote the grouped document to the root
//       },
//     ];

//     let results = await Flashcard.aggregate(pipeline);
//     if (topicSearch) {
//       results = results.filter((obj) =>
//         obj.topic.toLowerCase().includes(topicSearch.toLowerCase()),
//       );
//     }
//     results.sort((a: any, b: any) => (a.updatedAt < b.updatedAt ? 1 : -1));

//     return NextResponse.json({ results }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ msg: "Error fetching topics" }, { status: 500 });
//   }
// }

// async function RenameTopic(newTopicName: string, topicId: string) {
//   try {
//     const flashcards = await Flashcard.find({ topicId: topicId });

//     flashcards.forEach((obj) => (obj.topic = newTopicName));

//     // Update each document and save
//     flashcards.forEach((flashcard) => {
//       flashcard.topic = newTopicName;
//       flashcard.save();
//     });

//     return NextResponse.json({ newTopicName }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { msg: "Error fetching flashcards" },
//       { status: 500 },
//     );
//   }
// }
