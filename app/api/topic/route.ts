import { ITopic } from "@/models/Topic";
import { TopicRepository } from "@/repositories/TopicRepository";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

const topicRepository = new TopicRepository();

export async function GET(req: NextRequest) {
  try {
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
