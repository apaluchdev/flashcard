export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Topic from "@/models/Topic";

// READ
export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse> {
  try {
    console.log(`${req.url} triggered GET`);
    const topics = await Topic.find({});
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
