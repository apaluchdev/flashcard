import connect from "@/lib/mongoose-connect";
import Topic, { ITopic } from "@/models/Topic";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
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
