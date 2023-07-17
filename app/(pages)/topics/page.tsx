"use client"; // TODO this could and should be a server component, read up on how to convert

import flashcardClient from "@/lib/FlashcardClient";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import Flashcard from "@/types/Flashcard";

export default function Page() {
  const [topicCards, setTopics] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTopicsAsync = async () => {
      setIsLoading(true);
      await fetch(`/api/flashcard/topic?topicId=all`)
        .then((res) => res.json())
        .then((results) => {
          setTopics(results.topics);
        });
      setIsLoading(false);
    };

    getTopicsAsync();
  }, []);

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 style={{ fontSize: 64, color: "#000000" }}>List of Topics</h1>
          <div
            style={{ marginTop: "2rem" }}
            className="spinner-border"
            role="status"></div>
        </div>
      </main>
    );
  }

  if (topicCards.length < 1) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 style={{ fontSize: 64, color: "#000000" }}>No topics found!</h1>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 style={{ fontSize: 64, color: "#000000" }}>List of Topics</h1>
        <div style={{ marginTop: "2rem" }}>
          {topicCards.map((topicCard, index) => (
            <Link href={`/flashcard/test/${topicCard.topicId}`}>
              {topicCard.topic}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
