import Topic, { ITopic } from "@/models/Topic";
import { NextRequest, NextResponse } from "next/server";

// READ
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const topicTitle = searchParams.get("topicTitle");
    const userId = searchParams.get("userId");

    if (topicTitle && userId) {
      const topic: ITopic | null = await Topic.findOne({
        userId: userId,
        topicTitle: topicTitle,
      });

      if (!topic) throw new Error("Topic not found!");
      return NextResponse.json({ topic }, { status: 200 });
    }
    throw new Error("Topic not found for given id and title.");
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topics" }, { status: 500 });
  }
}
