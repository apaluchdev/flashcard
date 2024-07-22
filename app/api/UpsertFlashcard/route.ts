import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic from "@/models/Topic";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const body: IFlashcard = await req.json();

    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: req, secret });

    ValidateCard(body);

    const flashcard =
      (await Flashcard.findOne({ _id: body._id })) || new Flashcard();

    if (!token?.username) {
      throw new Error("No username associated with request");
    }

    flashcard.question = body.question;
    flashcard.answer = body.answer;
    flashcard.userId = String(token.username);
    flashcard.topicId = body.topicId;
    flashcard.order = body.order;

    // Check if the current user actually owns the topic they are adding a card to
    const topic = await Topic.findOne({ _id: flashcard.topicId });
    if (token.username != topic?.userId) {
      throw new Error("You cannot add cards to topics you do not own");
    }

    const savedFlashcard = await flashcard.save();

    return NextResponse.json({ savedFlashcard });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error inserting flashcard" },
      { status: 500 },
    );
  }
}

function ValidateCard(card: IFlashcard) {
  if (!card.question) throw new Error("Flashcard must have question filled.");
  if (!card.answer) throw new Error("Flashcard must have answer filled.");
  if (!card.topicId) throw new Error("Flashcard must have topicId filled.");
  if (!card.userId) throw new Error("Flashcard must have userId filled.");
}
