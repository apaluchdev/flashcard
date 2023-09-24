import InitializeMongoose from "@/lib/mongodb";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import { NextResponse } from "next/server";

InitializeMongoose();

export async function POST(req: any) {
  try {
    const body: IFlashcard = await req.json();

    ValidateCard(body);

    const flashcard =
      (await Flashcard.findOne({ _id: body._id })) || new Flashcard();

    flashcard.question = body.question;
    flashcard.answer = body.answer;
    flashcard.userId = body.userId;
    flashcard.topicId = body.topicId;
    flashcard.order = body.order;

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
