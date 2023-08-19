"use client";

import styles from "./page.module.css";
import Link from "next/link";
import ButtonModal from "@/components/ButtonModal/ButtonModal";
import AddFlashcard from "@/components/AddFlashcard/AddFlashcard";
import { IFlashcard } from "@/models/Flashcard";
import { useState } from "react";
import flashcardClient from "@/lib/flashcard-client";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  let newTopicFlashcard: IFlashcard = {
    topic: "",
    question: "",
    answer: "",
  };

  async function GenerateDeck() {
    setStatus("");
    setLoading(true);
    let result = await flashcardClient.GenerateDeck(topic, "medium");
    setLoading(false);

    if (result.userId && result.topicId)
      router.push(`/flashcard/${result.userId}/${result.topicId}`);
    else {
      setStatus("Failed generation likely due to bad AI response, try again.");
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Flashcards!</h1>
        <div className={styles.buttons}>
          <ButtonModal text="Add Deck">
            <div>
              <AddFlashcard
                flashcard={newTopicFlashcard}
                onSuccess={() => {}}
              />
            </div>
          </ButtonModal>
          <Link className={styles.button} href="/topics">
            Find Decks
          </Link>
        </div>
        <hr
          style={{
            marginTop: "100px",
            border: "none",
            width: "100%",
            height: "1px",
            backgroundColor: "black",
          }}
        ></hr>
        <div className={styles.generate}>
          <h1>Generate a deck using AI</h1>
          <p className={styles.preview}>! Work in progess preview !</p>
          <div className={styles.genPrompt}>
            <h3 className={styles.enterTopicHeader}>Enter a topic:</h3>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={styles.aiInput}
            ></input>
            <button onClick={GenerateDeck} className={styles.button}>
              Generate
            </button>
            <div className={styles.loading}>
              {isLoading && <LoadingSpinner />}
              {status}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
