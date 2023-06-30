"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./FlashCard.module.css";
import { useState, useEffect } from "react";

export default function FlashCard() {
  const [isLoading, setLoading] = useState(false);
  const [cardData, setCard] = useState<{
    cards: Flashcard[];
    cardIndex: number;
  }>({
    cards: [],
    cardIndex: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetch("/api/flashcard")
      .then((res) => res.json())
      .then((apiCardData) => {
        setCard({
          cards: apiCardData.cards,
          cardIndex: 0,
        });
        setLoading(false);
      });
  }, []);

  // Next and previous buttons
  const NextAndPrevButtons = () => {
    function NextCard() {
      if (cardData.cardIndex == cardData.cards.length - 1) return;
      setCard({ cards: cardData.cards, cardIndex: ++cardData.cardIndex });
    }

    function PreviousCard() {
      if (cardData.cardIndex == 0) return;
      setCard({ cards: cardData.cards, cardIndex: --cardData.cardIndex });
    }

    return (
      <div className={styles.flashCardControl}>
        <div className={styles.buttons}>
          <button onClick={PreviousCard} className={styles.button}>
            Previous
          </button>
          <button onClick={NextCard} className={styles.button}>
            Next
          </button>
        </div>
        <p className={styles.cardCount}>
          {cardData.cardIndex + 1} / {cardData.cards.length}
        </p>
      </div>
    );
  };

  if (isLoading || cardData.cards.length < 1 || !cardData)
    return (
      <div
        style={{ marginTop: "2rem" }}
        className="spinner-border"
        role="status"></div>
    );

  return (
    <div>
      <NextAndPrevButtons />
      <div className={styles.flashCard}>
        <div className={styles.flashCardInner}>
          {/* Flashcard Front  */}
          <div className={styles.flashCardFront}>
            <h2 className={styles.question}>
              {cardData.cards.length < 1
                ? "No cards found..."
                : cardData.cards[cardData.cardIndex].question}
            </h2>
          </div>
          {/* Flashcard Back */}
          <div className={styles.flashCardBack}>
            <h2 className={styles.question}>
              {cardData.cards.length < 1
                ? "No cards found..."
                : cardData.cards[cardData.cardIndex].question}
            </h2>
            <p className={styles.answer}>
              {cardData.cards.length < 1
                ? "No cards found..."
                : cardData.cards[cardData.cardIndex].answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
