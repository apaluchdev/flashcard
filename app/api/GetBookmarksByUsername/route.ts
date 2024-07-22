import User, { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// READ
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const username = searchParams.get("username");

    if (!username) throw new Error("Username required");

    const user: IUser | null = await User.findOne({
      username: username,
    });

    if (!user) throw new Error("User not found");

    return NextResponse.json(
      { bookmarks: user.bookmarkedCards },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ msg: "Error fetching topics" }, { status: 500 });
  }
}
