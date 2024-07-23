import { GetFlashcardsByUserIdAndTopicTitleAsync } from "@/app/api/GetFlashcardsByUserIdAndTopicTitle/route";
import FlashcardComponent from "@/components/flashcard-card/flashcard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { userId: string; topicTitle: string };
}

export default async function Page({
  params: { userId, topicTitle },
}: PageProps) {
  // let topic = await topicClient.GetTopicByUserIdAndTopicTitle(
  //   userId,
  //   topicTitle,
  // );

  // if (!topic)
  //   return (
  //     <div>
  //       Something went wrong trying to find a topic for userId {userId} and
  //       topicTitle {decodeURIComponent(topicTitle)}
  //     </div>
  //   );
  return (
    <main className="flex h-screen flex-col items-center">
      <FlashcardComponent
        userId={userId}
        topic={decodeURIComponent(topicTitle)}
        flashcardData={await GetFlashcardsByUserIdAndTopicTitleAsync(
          userId,
          decodeURIComponent(topicTitle),
        )}
      />
    </main>
  );
}
