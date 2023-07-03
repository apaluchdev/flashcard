"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./Flashcard.module.css";
import { useState, useEffect } from "react";
import ButtonModal from "@/components/modal/ButtonModal";
import TopicTitle from "@/components/topic-title/TopicTitle";
import AddFlashcard from "@/components/add-flashcard/AddFlashcard";

interface FlashcardProps {
  userId: string;
  topicId: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ userId, topicId }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [topic, setTopic] = useState<string>("");
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    setLoading(true);

    const GetData = async () => {
      await LoadCards();
      await GetTopicFromTopicId(topic);
      setLoading(false);
    };

    GetData();
  }, []);

  async function GetTopicFromTopicId(topic: string) {
    await fetch(`/api/flashcard/GetTopicById/${topicId}`)
      .then((res) => res.json())
      .then((res) => {
        setTopic(res.topic);
      });
  }

  // Load cards and verify current card index is valid
  async function LoadCards(index: number = 0) {
    await fetch(`/api/flashcard?userId=${userId}&topicId=${topicId}`)
      .then((res) => res.json())
      .then((results) => {
        setCards(results.cards);
        setCardIndex(index < 0 || index >= cards.length ? 0 : index);
      });
  }

  const NextAndPrevButtons = () => {
    function NextCard() {
      if (cardIndex == cards.length - 1) return;
      setCardIndex(cardIndex + 1);
    }

    function PreviousCard() {
      if (cardIndex == 0) return;
      setCardIndex(cardIndex - 1);
    }

    return (
      <div>
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
            {cardIndex + 1} / {cards.length}
          </p>
        </div>
      </div>
    );
  };

  // Next and previous buttons
  const DeleteFlashcardButton = () => {
    async function deleteFlashcard() {
      try {
        await fetch(`/api/flashcard?id=${cards[cardIndex].id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        LoadCards(cardIndex - 1 < 0 ? 0 : cardIndex - 1);
      } catch (error) {
        console.error("An error occurred while deleting the item:", error);
      }
    }

    return (
      <button onClick={deleteFlashcard} className={styles.button}>
        Delete Flashcard
      </button>
    );
  };

  //Show only spinner if no cards are loaded
  if (isLoading) {
    return (
      <div
        style={{ marginTop: "2rem" }}
        className="spinner-border"
        role="status"></div>
    );
  }

  if (cards.length < 1) {
    return (
      <div>
        {/* <TopicTitle topic={topic} /> */}
        <h1 style={{ marginBottom: "75px" }}>No cards found for topic</h1>
        <ButtonModal text="Add Flashcard">
          <AddFlashcard
            topicId={topicId}
            userId={userId}
            onSuccess={() => LoadCards(cards.length)}
            cards={cards}
          />
        </ButtonModal>
      </div>
    );
  }

  return (
    <div>
      <TopicTitle topic={topic} />
      <div>
        <NextAndPrevButtons />
      </div>
      <div className={styles.flashCard}>
        <div className={styles.flashCardInner}>
          {/* Flashcard Front  */}
          <div className={styles.flashCardFront}>
            <h2 className={styles.question}>{cards[cardIndex].question}</h2>
          </div>
          {/* Flashcard Back */}
          <div className={styles.flashCardBack}>
            <h2 className={styles.question}>{cards[cardIndex].question}</h2>
            <p className={styles.answer}>{cards[cardIndex].answer}</p>
          </div>
        </div>
      </div>
      <div className={styles.addDeleteButtons}>
        <DeleteFlashcardButton />
        <ButtonModal text="Add Flashcard">
          <AddFlashcard
            topicId={topicId}
            userId={userId}
            onSuccess={LoadCards}
            cards={cards}
          />
        </ButtonModal>
      </div>
    </div>
  );
};

export default Flashcard;
