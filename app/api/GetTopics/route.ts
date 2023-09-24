import { NextRequest, NextResponse } from "next/server";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";

// READ
export async function GET(req: NextRequest) {
  try {
    const topics = await Topic.find();
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
