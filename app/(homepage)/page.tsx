"use client";

import styles from "./page.module.css";
import Link from "next/link";
import ButtonModal from "@/components/ButtonModal/ButtonModal";
import AddFlashcard from "@/components/AddFlashcard/AddFlashcard";
import Flashcard from "@/types/Flashcard";

export default function Page() {
  let flashcard: Flashcard = {
    topic: "",
    topicId: "",
    userId: "Adrian",
    question: "",
    answer: "",
    order: 0,
  };

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Flashcards!</h1>
        <div className={styles.buttons}>
          <ButtonModal text="Add Topic">
            <div>
              <AddFlashcard flashcard={flashcard} onSuccess={() => {}} />
            </div>
          </ButtonModal>
          <Link className={styles.button} href="/topics">
            Find Topics
          </Link>
        </div>
      </div>
    </main>
  );
}
