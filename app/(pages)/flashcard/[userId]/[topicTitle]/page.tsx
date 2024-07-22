import FlashcardComponent from "@/components/flashcard-card/flashcard";
import connect from "@/lib/mongoose-connect";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic from "@/models/Topic";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { userId: string; topicTitle: string };
}

export default async function Page({
  params: { userId, topicTitle },
}: PageProps) {
  await connect();

  const topic = await Topic.findOne({
    userId: userId,
    topicTitle: decodeURIComponent(topicTitle),
  });

  if (!topic)
    return (
      <div>
        Something went wrong trying to find a topic for userId {userId} and
        topicTitle {decodeURIComponent(topicTitle)}
      </div>
    );

  const flashcards: IFlashcard[] = JSON.parse(
    JSON.stringify(await Flashcard.find({ topicId: topic._id })),
  );

  return (
    <main className="flex h-screen flex-col items-center">
      <FlashcardComponent
        userId={userId}
        topic={topicTitle}
        flashcardData={flashcards}
      />
    </main>
  );
}
