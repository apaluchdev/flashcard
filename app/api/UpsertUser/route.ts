// const secret = process.env.NEXTAUTH_SECRET;
// const token = await getToken({ req: request, secret });

import User, { IUser } from "@/models/User";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: request, secret });

    const body: IUser = await request.json();

    if (!token?.email) throw new Error("No email found in token or user");

    let user = await User.findOne({ email: token?.email });
    if (user && user.username != token.username)
      throw new Error("User already exists!");

    user = new User();

    user.email = token.email;
    user.username = body.username;

    const savedUser = await user.save();

    return NextResponse.json({ savedUser });
  } catch (error) {
    return NextResponse.json({ msg: "Error upserting user" }, { status: 500 });
  }
}
