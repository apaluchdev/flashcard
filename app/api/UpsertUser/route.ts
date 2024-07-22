// const secret = process.env.NEXTAUTH_SECRET;
// const token = await getToken({ req: request, secret });

import connect from "@/lib/mongoose-connect";
import User, { IUser } from "@/models/User";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: request, secret });

    const body: IUser = await request.json();

    if (!token?.email) throw new Error("No email found in token or user");

    let user = await User.findOne({ email: token?.email });
    if (user && user.username != token.username)
      throw new Error("User already exists!");

    if (!user) user = new User();

    let bookmarks =
      user.bookmarkedCards?.concat(body.bookmarkedCards ?? []) ?? [];

    user.email = token.email;
    user.username = body.username;
    user.bookmarkedCards = bookmarks.filter(
      (item, i, ar) => ar.indexOf(item) === i,
    ); // Ensure all bookmarks are unique

    const savedUser = await user.save();

    return NextResponse.json({ savedUser });
  } catch (error) {
    return NextResponse.json({ msg: "Error upserting user" }, { status: 500 });
  }
}
