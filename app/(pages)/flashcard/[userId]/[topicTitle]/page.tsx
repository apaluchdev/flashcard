import FlashcardComponent from "@/components/flashcard-card/flashcard";
import Flashcard, { IFlashcard } from "@/models/Flashcard";
import Topic, { ITopic } from "@/models/Topic";

interface PageProps {
  params: { userId: string; topicTitle: string };
}

export default async function Page({
  params: { userId, topicTitle },
}: PageProps) {
  const topic = await Topic.findOne({
    userId: userId,
    topicTitle: decodeURIComponent(topicTitle),
  });

  if (!topic) return <div>Something went wrong...</div>;

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
