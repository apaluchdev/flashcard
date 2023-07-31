import Flashcard from "@/components/Flashcard/Flashcard"; //Fixed
import styles from "./page.module.css";

interface PageProps {
  params: { userId: string; topicId: string };
}

export default async function Page({ params: { userId, topicId } }: PageProps) {
  return (
    <main className={styles.main}>
      <Flashcard userId={userId} topicId={topicId} />
    </main>
  );
}
