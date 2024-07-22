import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";
import connect from "@/lib/mongoose-connect";

// READ
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    console.log("Getting topic by id");
    const { searchParams } = new URL(req.url);

    const topicId = searchParams.get("topicId");

    if (topicId) var topic = await Topic.find({ }); //    if (topicId) var topic = await Topic.find({ _id: topicId });
    else throw new Error("Topic Id not found");

    return NextResponse.json({ topic }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
