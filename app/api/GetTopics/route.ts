import { NextRequest, NextResponse } from "next/server";
import Topic, { ITopic } from "@/models/Topic";

// READ
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("Finding topics!");
    const topics: ITopic[] = await Topic.find();
    console.log(`Found topics: ${topics}`);
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.log(`Error in API GET for topics ${error}`);
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
