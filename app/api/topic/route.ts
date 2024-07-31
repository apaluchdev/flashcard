import connect from "@/lib/mongoose-connect";
import { ITopic } from "@/models/Topic";
import { TopicRepository } from "@/repositories/TopicRepository";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

const topicRepository = new TopicRepository();

export async function GET(req: NextRequest) {
  try {
    connect();

    const { searchParams } = new URL(req.url);

    var topics: ITopic[] = [];

    if (searchParams.has("userId"))
      topics = await topicRepository.getByUserId(
        searchParams.get("userId") as string,
      );
    else topics = await topicRepository.getAll();

    return NextResponse.json({ topics }, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.log(`Error in API GET for topics ${error}`);

    return NextResponse.json(
      { msg: "Error fetching topics" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    connect();

    const topic: ITopic = await req.json();

    var existingTopic: ITopic | null = null;

    if (topic._id) {
      existingTopic = await topicRepository.getById(topic._id);
    }

    if (existingTopic) {
      const updatedTopic = await topicRepository.update(topic);
      return NextResponse.json(
        { topic: updatedTopic },
        { status: HttpStatusCode.Created },
      );
    } else {
      const insertedTopic = await topicRepository.insert(topic);
      return NextResponse.json(
        { topic: insertedTopic },
        { status: HttpStatusCode.Created },
      );
    }
  } catch (error) {
    console.log(`Error in API POST for topic ${error}`);

    return NextResponse.json(
      { msg: "Error inserting topic" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}