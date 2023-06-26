"use client";

import styles from "./FlashCard.module.css";
import Image from "next/image";
import { Inter, Roboto, Quicksand } from "next/font/google";
import { useState, useEffect } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Fonts
const inter = Inter({ weight: "300", subsets: ["latin"] });
const roboto = Roboto({ weight: "400", subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"], weight: "400" });

type Card = {
  id: string;
  question: string;
  answer: string;
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: number;
};

export default function FlashCard() {
  const [cardData, setCard] = useState<{ cards: Card[]; cardIndex: number }>({
    cards: [],
    cardIndex: 0,
  });
  const [isLoading, setLoading] = useState(false);

  function NextCard() {
    if (cardData.cardIndex == cardData.cards.length - 1) return;
    setCard({ cards: cardData.cards, cardIndex: ++cardData.cardIndex });
  }

  function PreviousCard() {
    if (cardData.cardIndex == 0) return;
    setCard({ cards: cardData.cards, cardIndex: --cardData.cardIndex });
  }

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

  if (isLoading || cardData.cards.length < 1 || !cardData)
    return (
      <div
        style={{ marginTop: "2rem" }}
        className="spinner-border"
        role="status"></div>
    );

  return (
    <div>
      {/* Buttons  */}
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

      <div className={styles.flipCard}>
        <div className={styles.flipCardInner}>
          {/* Flashcard Front */}
          <div className={styles.flipCardFront}>
            <h2 className={styles.question}>
              {cardData.cards.length < 1
                ? "No cards found..."
                : cardData.cards[cardData.cardIndex].question}
            </h2>
          </div>
          {/* Flashcard Back */}
          <div className={styles.flipCardBack}>
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
