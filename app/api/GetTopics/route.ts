export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Topic from "@/models/Topic";

// READ
export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse> {
  try {
    return NextResponse.json({ msg: "This is a test" }, { status: 200 });
    // console.log(`${req.url} triggered GET`);
    // const topics = await Topic.find({});
    // console.log(`1`);
    // var result = NextResponse.json({ topics }, { status: 200 });
    // console.log(`2`);
    // return result;
  } catch (error) {
    console.log("Encountered an error " + error);
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
