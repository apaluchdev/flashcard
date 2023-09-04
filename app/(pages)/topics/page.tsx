"use client"; // TODO this could and should be a server component, read up on how to convert

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { IFlashcard } from "@/models/Flashcard";
import ButtonModal from "@/components/ButtonModal/ButtonModal";
import flashcardClient from "@/lib/flashcard-client";

export default function Page() {
  const [topicCards, setTopics] = useState<IFlashcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageTitle, setPageTitle] = useState<string>("Recent Topics");

  useEffect(() => {
    const getTopicsAsync = async () => {
      setIsLoading(true);
      let topics = await flashcardClient.GetTopics("");
      setTopics(topics.slice(0, 10));
      setIsLoading(false);
    };

    getTopicsAsync();
  }, []);

  const SearchTopic = () => {
    const [topicSearch, setTopicSearch] = useState<string>("");

    const SearchTopic = async () => {
      setPageTitle("Found Topics");
      setIsLoading(true);
      let topics = await flashcardClient.GetTopics(topicSearch);
      setTopics(topics);
      setIsLoading(false);
    };

    return (
      <form className={styles.searchTopicForm} onSubmit={SearchTopic}>
        <div className={styles.searchTopic}>
          <label className="">Search Topics:</label>
          <input
            className={styles.topicInput}
            type="text"
            required
            value={topicSearch}
            onChange={(e) => setTopicSearch(e.target.value)}
          />
          {/* Submit Button  */}
          <button className={styles.button}>Submit</button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 style={{ fontSize: 64, color: "#000000", marginBottom: "2rem" }}>
            {pageTitle}
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
          <SearchTopic />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 style={{ fontSize: 64, color: "#000000" }}>Topics</h1>
        <SearchTopic />
        <h1 style={{ fontSize: 32, color: "#000000" }}>{pageTitle}</h1>
        <div style={{ marginTop: "2rem", textDecoration: "none" }}>
          {topicCards.map((card, index) => (
            <p key={index}>
              <Link
                style={{ textDecoration: "none" }}
                href={`/flashcard/${card.userId}/${card.topicId}`}
              >
                {card.topic}
              </Link>
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
