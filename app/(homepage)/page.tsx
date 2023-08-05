"use client";

import styles from "./page.module.css";
import Link from "next/link";
import ButtonModal from "@/components/ButtonModal/ButtonModal";
import AddFlashcard from "@/components/AddFlashcard/AddFlashcard";
import Flashcard, { IFlashcard } from "@/models/Flashcard";

export default function Page() {
  let newTopicFlashcard: IFlashcard = new Flashcard({
    topic: "",
    question: "",
    answer: "",
  });

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Flashcards!</h1>
        <div className={styles.buttons}>
          <ButtonModal text="Add Topic">
            <div>
              <AddFlashcard
                flashcard={newTopicFlashcard}
                onSuccess={() => {}}
              />
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
