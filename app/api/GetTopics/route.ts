export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Topic from "@/models/Topic";

// READ
export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse> {
  try {
    const topics = await Topic.find({});
    console.log("Number of topics found " + topics.length);
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.log("Encountered an error " + error);
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
