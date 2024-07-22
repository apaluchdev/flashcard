export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Topic from "@/models/Topic";
import axios from "axios";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// READ
export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse> {
  try {
    const response = await axios.get<User[]>(
      "https://jsonplaceholder.typicode.com/users",
    );
    return NextResponse.json({ users: response.data }, { status: 200 });
  } catch (error) {
    console.log("Encountered an error " + error);
    return NextResponse.json({ msg: "Error fetching topic" }, { status: 500 });
  }
}
