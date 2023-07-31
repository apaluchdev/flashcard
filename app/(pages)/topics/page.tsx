"use client"; // TODO this could and should be a server component, read up on how to convert

import flashcardClient from "@/lib/FlashcardClient";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import Flashcard from "@/types/Flashcard";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function Page() {
  const [topicCards, setTopics] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTopicsAsync = async () => {
      setIsLoading(true);
      await fetch(`/api/flashcard`)
        .then((res) => res.json())
        .then((res) => {
          setTopics(res.results);
        });
      setIsLoading(false);
    };

    getTopicsAsync();
  }, []);

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 style={{ fontSize: 64, color: "#000000", marginBottom: "2rem" }}>
            List of Topics
          </h1>
          <LoadingSpinner />
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
        <div style={{ marginTop: "2rem", textDecoration: "none" }}>
          {topicCards.map((card, index) => (
            <p key={index}>
              <Link
                style={{ textDecoration: "none" }}
                href={`/flashcard/${card.userId}/${card.topicId}`}>
                {card.topic}
              </Link>
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
