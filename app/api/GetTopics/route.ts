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
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
