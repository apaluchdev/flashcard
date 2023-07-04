//import Flashcard from "../../components/flashcard/Flashcard";
import styles from "./page.module.css";

interface PageProps {
  params: { userId: string; topicId: string };
}

export default async function Page({ params: { userId, topicId } }: PageProps) {
  return (
    <main className={styles.main}>
      HI
      {/* <Flashcard userId={userId} topicId={topicId} /> */}
    </main>
  );
}
