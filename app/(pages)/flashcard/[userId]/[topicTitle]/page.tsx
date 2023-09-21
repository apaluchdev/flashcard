import Flashcard from "@/components/flashcard/flashcard"; //Fixed
import styles from "./page.module.css";
import TextEditor from "@/components/text-editor/text-editor";
import AddDeck from "@/components/add-deck/add-deck";

interface PageProps {
  params: { userId: string; topicTitle: string };
}

export default async function Page({
  params: { userId, topicTitle },
}: PageProps) {
  return (
    <main className="flex h-screen flex-col items-center">
      <Flashcard userId={userId} topic={topicTitle} />
      {/* <TextEditor /> */}
    </main>
  );
}
