import Flashcard from "@/components/flashcard/flashcard";

interface PageProps {
  params: { userId: string; topicTitle: string };
}

export default async function Page({
  params: { userId, topicTitle },
}: PageProps) {
  return (
    <main className="flex h-screen flex-col items-center">
      <Flashcard userId={userId} topic={topicTitle} />
    </main>
  );
}
