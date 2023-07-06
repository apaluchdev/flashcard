"use client";

import styles from "./page.module.css";
import Link from "next/link";
import ButtonModal from "@/components/modal/ButtonModal";
import AddTopic from "@/components/add-topic/AddTopic";

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Flashcards!</h1>
        <div className={styles.buttons}>
          <ButtonModal text="Add Flashcard">
            <div>
              <AddTopic />
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
