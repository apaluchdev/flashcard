import FlashcardComponent from "@/components/flashcard-card/flashcard";
import connect from "@/lib/mongoose-connect";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { userId: string; topicTitle: string };
}

export default async function Page({
  params: { userId, topicTitle },
}: PageProps) {
  await connect();

  console.log(
    "Trying to find a topic for user: ",
    userId,
    " and topic: ",
    decodeURIComponent(topicTitle),
  );
  const topic: ITopic | null = await Topic.findOne({
    userId: userId,
    topicTitle: decodeURIComponent(topicTitle),
  });

  if (!topic) throw new Error("Could not find topic");
  const flashcardModels = await Flashcard.find({ topicId: topic._id });
  flashcardModels.sort((a: any, b: any) =>
    a.createdAt > b.createdAt ? -1 : 1,
  );
  const flashcards = flashcardModels as IFlashcard[];

  return (
    <main className="flex h-screen flex-col items-center">
      <FlashcardComponent
        userId={userId}
        topic={decodeURIComponent(topicTitle)}
        flashcardData={flashcards}
      />
    </main>
  );
}
