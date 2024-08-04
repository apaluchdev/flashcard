import connect from "@/lib/mongoose-connect";
import Topic, { ITopic } from "@/models/Topic";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { TopicRepository } from "@/repositories/TopicRepository";

const topicRepository = new TopicRepository();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized },
      );
    }
    await connect();

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { msg: "id required" },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const topics: ITopic[] = await Topic.find({
      id: id,
    });

    return NextResponse.json({ topics }, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.log(`Error in API GET for topics ${error}`);

    return NextResponse.json(
      { msg: "Error fetching topics" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized },
      );
    }
    await connect();

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { msg: "id required" },
        { status: HttpStatusCode.BadRequest },
      );
    }

    const topic = await topicRepository.getById(id);

    if (!topic) {
      return NextResponse.json(
        { msg: "Topic not found" },
        { status: HttpStatusCode.NotFound },
      );
    }

    if (topic.userId !== session.user.id) {
      return NextResponse.json(
        { msg: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized },
      );
    }

    await topicRepository.delete(id);

    return NextResponse.json(
      { msg: "Topic deleted successfully" },
      { status: HttpStatusCode.Ok },
    );
  } catch (error) {
    console.log(`Error in API DELETE for topics ${error}`);

    return NextResponse.json(
      { msg: "Error deleting topic" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
