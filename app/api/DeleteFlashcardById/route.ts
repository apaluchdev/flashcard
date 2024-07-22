import connect from "@/lib/mongoose-connect";
import Flashcard from "@/models/Flashcard";
import { NextRequest, NextResponse } from "next/server";

// DELETE
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw Error("Flashcard not found.");

    await Flashcard.deleteOne({ _id: id });

    return NextResponse.json(
      { msg: `Deleted Flashcard with id: ${id}` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Error deleting flashcard" },
      { status: 500 },
    );
  }
}
