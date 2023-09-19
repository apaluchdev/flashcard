import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import InitializeMongoose from "@/lib/mongodb";
import { randomUUID } from "crypto";
import Topic, { ITopic } from "@/models/Topic";

InitializeMongoose();

// CREATE
export async function POST(req: any) {
  try {
    const body: ITopic = await req.json();

    if (!body.topicTitle)
      return NextResponse.json(
        {
          message: "Topic requires a topic title.",
        },
        { status: 400 },
      );

    if (!body.userId)
      return NextResponse.json(
        {
          message: "Topic requires a topic title.",
        },
        { status: 400 },
      );

    const topic = (await Topic.findOne({ _id: body._id })) || new Topic();

    topic.topicTitle = body.topicTitle;
    topic.userId = body.userId;

    const savedTopic = await topic.save();

    return NextResponse.json({ savedTopic });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error inserting flashcard" },
      { status: 500 },
    );
  }
}

// READ
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const topicId = searchParams.get("topicId");

  const topic = searchParams.get("topic");
  const userId = searchParams.get("userId");

  if (topicId) return await GetFlashcards(topicId);

  if (topic && userId) return await GetTopicByUserIdAndTopic(userId, topic);
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

async function GetFlashcards(topicId: string) {
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

async function GetTopicByUserIdAndTopic(userId: string, topic: string) {
  try {
    const topicResult: ITopic | null = await Topic.findOne({
      userId: userId,
      topicTitle: topic,
    });

    if (!topicResult) throw new Error("Topic not found!");
    return NextResponse.json({ topicResult }, { status: 200 });
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
