"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./Flashcard.module.css";
import { useState, useEffect } from "react";
import ButtonModal from "../modal/ButtonModal";
import TopicTitle from "../topic-title/TopicTitle";
import AddFlashcard from "../add-flashcard/AddFlashcard";

interface FlashcardProps {
  userId: string;
  topicId: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ userId, topicId }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [topic, setTopic] = useState<string>("");
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [cards, setCards] = useState<Flashcard[]>([]);

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.front}>Front</div>
        <div className={styles.back}>Back!</div>
      </div>
    </div>
  );
};

export default Flashcard;
