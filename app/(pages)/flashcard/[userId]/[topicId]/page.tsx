import Flashcard from "@/components/Flashcard/Flashcard"; //Fixed
import styles from "./page.module.css";

//git config core.ignorecase false ! NEEDED TO FIX A CASE ISSUE WITH GITHUB ACTIONS

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
