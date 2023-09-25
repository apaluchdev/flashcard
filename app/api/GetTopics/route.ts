import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";

// READ
export async function GET(req: NextRequest) {
  try {
    console.log("Finding topics!");
    const topics = await Topic.find();
    console.log(`Found topics: ${topics}`);
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.log(`Error in API GET for topics ${error}`);
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
