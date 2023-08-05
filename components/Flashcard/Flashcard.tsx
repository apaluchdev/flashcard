"use client";

import styles from "./Flashcard.module.css";
import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ButtonModal from "../ButtonModal/ButtonModal";
import AddFlashcard from "../AddFlashcard/AddFlashcard";
import { IFlashcard } from "@/models/Flashcard";

interface FlashcardProps {
  userId: string;
  topicId: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ userId, topicId }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<IFlashcard[]>([]);
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
        let cards: IFlashcard[] = res.flashcards;
        setCards(
          cards.sort((a, b) => ((a.order || 0) > (b.order || 0) ? 1 : -1))
        );
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
        // create an api client class
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

  const EditCard = () => {
    // let flashcard: FlashcardData = {
    //   question: cards[cardIndex].question,
    //   answer:
    // }

    return (
      <div className={styles.navigation}>
        <ButtonModal text="Edit Card">
          {/* Topic is not being set, fix it! */}
          <AddFlashcard
            flashcard={cards[cardIndex]}
            onSuccess={() => LoadCards(cardIndex)}
          />
        </ButtonModal>
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  let flashcard: IFlashcard = {
    topic: cards[cardIndex].topic || "",
    topicId: cards[cardIndex].topicId || "",
    userId: cards[cardIndex].userId || "",
    question: cards[cardIndex].question || "",
    answer: cards[cardIndex].answer || "",
    order: cardIndex + 1,
  };

  return (
    <div className={styles.flashcardView}>
      <Title />
      <div className={styles.topButtons}>
        <Navigation />

        <div className={styles.topRightButtons}>
          <EditCard />
          <ButtonModal text="Add Flashcard">
            <AddFlashcard
              flashcard={flashcard}
              onSuccess={() => LoadCards(cards.length - 1)}
            />
          </ButtonModal>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.content}>
          <Front />
          <Back />
        </div>
      </div>
      <Delete />
    </div>
  );
};

export default Flashcard;
