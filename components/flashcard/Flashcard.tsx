"use client";

import FlashcardData from "@/types/Flashcard";
import styles from "./Flashcard.module.css";
import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ButtonModal from "../ButtonModal/ButtonModal";
import AddFlashcard from "../AddFlashcard/AddFlashcard";

interface FlashcardProps {
  userId: string;
  topicId: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ userId, topicId }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const GetData = async () => {
      setLoading(true);
      await LoadCards();
      await LoadTitle();
      setLoading(false);
    };

    GetData();
  }, []);

  // Load cards and verify current card index is valid
  async function LoadCards(index: number = 0) {
    await fetch(`/api/flashcard?userId=${userId}&topicId=${topicId}`)
      .then((res) => res.json())
      .then((res) => {
        setCards(res.flashcards);
        setCardIndex(index);
      });
  }

  // Get Title
  async function LoadTitle() {
    await fetch(`/api/flashcard?topicId=${topicId}&getTitle=Y`)
      .then((res) => res.json())
      .then((res) => {
        setTitle(res.title);
      });
  }

  const Title = () => {
    return (
      <div>
        <h3 style={{ textAlign: "left" }}>Current Topic:</h3>
        <h1 style={{ fontSize: 64, color: "#802424" }}>
          {title ?? "No topic found"}
        </h1>
      </div>
    );
  };

  const Delete = () => {   
    async function DeleteCard() {
      try {
        await fetch(`/api/flashcard?id=${cards[cardIndex]._id}`, {
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
      <div className={styles.bottomButtons}>
        <button
          onClick={DeleteCard}
          className={`${styles.button} ${styles.deleteButton}`}>
          Delete
        </button>
      </div>
    );
  };

  const Front = () => {
    return (
      <div className={styles.front}>
        <h1 className={styles.question}>{cards[cardIndex].question}</h1>
      </div>
    );
  };

  const Back = () => {
    return (
      <div className={styles.back}>
        <div>
          <h1 className={styles.question}>{cards[cardIndex].question}</h1>
          <p className={styles.answer}>{cards[cardIndex].answer}</p>
        </div>
      </div>
    );
  };

  const Navigation = () => {
    function NextCard() {
      setCardIndex(
        cardIndex >= cards.length - 1 ? cards.length - 1 : cardIndex + 1
      );
    }
    function PreviousCard() {
      setCardIndex(cardIndex < 1 ? 0 : cardIndex - 1);
    }

    return (
      <div className={styles.navigation}>
        <button onClick={PreviousCard} className={styles.button}>
          Previous
        </button>
        <button onClick={NextCard} className={styles.button}>
          Next
        </button>
      </div>
    );
  };

  // If finished loading and no cards found
  if (!isLoading && (!cards || cards.length < 1)) {
    return (
      <div>
        <h1>No cards found!</h1>
      </div>
    );
  }

  return (
    <div className={styles.flashcardView}>
      {!isLoading && <Title />}
      <div className={styles.topButtons}>
        <Navigation />
        <ButtonModal text="Add Flashcard">
          <AddFlashcard
            topicId={topicId}
            userId={userId}
            onSuccess={() => LoadCards(cards.length)}
            cards={cards}
          />
        </ButtonModal>
      </div>
      <div className={styles.card}>
        {isLoading ? (
          <div className={styles.loadingIcon}>
            <LoadingSpinner />
          </div>
        ) : (
          <div className={styles.content}>
            <Front />
            <Back />
          </div>
        )}
      </div>
      <Delete />
    </div>
  );
};

export default Flashcard;
