import connect from "@/lib/mongoose-connect";
import Topic, { ITopic } from "@/models/Topic";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    await connect();

    const body: ITopic = await req.json();

    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: req, secret });

    if (!token?.username) {
      throw new Error("No username associated with request");
    }

    let topic = await Topic.findOne({ _id: body._id });

    if (topic && topic.userId != token.username) {
      throw new Error("Cannot update a topic you do not own!");
    }

    if (!topic) topic = new Topic();

    topic.userId = String(token.username);
    topic.topicTitle = body.topicTitle;

    const savedTopic = await topic.save();

    return NextResponse.json({ savedTopic });
  } catch (error) {
    return NextResponse.json({ msg: "Error upserting topic" }, { status: 500 });
  }
}
