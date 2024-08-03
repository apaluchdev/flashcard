import FlashcardViewer from "@/components/flashcard/flashcard-viewer";
import { FlashcardRepository } from "@/repositories/FlashcardRepository";
import { TopicRepository } from "@/repositories/TopicRepository";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { topicId: string };
}

export default async function Page({ params: { topicId } }: PageProps) {
  const topicRepository = new TopicRepository();
  const flashcardRepository = new FlashcardRepository();

  const topic = await topicRepository.getById(topicId);
  const flashcards = await flashcardRepository.getByTopicId(topicId);

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <main>
      <FlashcardViewer
        topic={JSON.parse(JSON.stringify(topic))}
        flashcardsProp={JSON.parse(JSON.stringify(flashcards)) ?? []}
      />
    </main>
  );
}
