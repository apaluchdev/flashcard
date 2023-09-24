import Topic, { ITopic } from "@/models/Topic";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const body: ITopic = await req.json();

    const topic = (await Topic.findOne({ _id: body._id })) || new Topic();

    topic.userId = body.userId;
    topic.topicTitle = body.topicTitle;

    const savedTopic = await topic.save();

    return NextResponse.json({ savedTopic });
  } catch (error) {
    return NextResponse.json({ msg: "Error upserting topic" }, { status: 500 });
  }
}
