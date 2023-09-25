import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";

// READ
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const topicId = searchParams.get("topicId");

    if (topicId) var topic = await Topic.find({ _id: topicId });
    else throw new Error("Topic Id not found");

    return NextResponse.json({ topic }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
