"use client";

import styles from "./Flashcard.module.css";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import ButtonModal from "@/components/ButtonModal/ButtonModal";
import AddFlashcard from "@/components/AddFlashcard/AddFlashcard";
import { IFlashcard } from "@/models/Flashcard";
import flashcardClient from "@/lib/flashcard-client";

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

  async function LoadCards(index: number = 0) {
    let cards: IFlashcard[] = await flashcardClient.GetFlashcards(
      userId,
      topicId
    );

    setCards(cards.sort((a, b) => ((a.order || 0) > (b.order || 0) ? 1 : -1)));
    setCardIndex(index);
  }

  async function LoadTitle() {
    let title: string = await flashcardClient.GetTitle(topicId);
    setTitle(title);
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
      var isDeleted = await flashcardClient.DeleteCard(
        cards[cardIndex]._id || ""
      );
      if (isDeleted) LoadCards(cardIndex - 1 < 0 ? 0 : cardIndex - 1);
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
    return (
      <div className={styles.navigation}>
        <ButtonModal text="Edit Card">
          <AddFlashcard
            flashcard={cards[cardIndex]}
            onSuccess={() => LoadCards(cardIndex)}
          />
        </ButtonModal>
      </div>
    );
  };

  const AddCard = () => {
    let blankCard: IFlashcard = {
      topicId: cards[cardIndex].topicId,
      question: "",
      answer: "",
      topic: cards[cardIndex].topic,
    };

    return (
      <div className={styles.navigation}>
        <ButtonModal text="Add Flashcard">
          <AddFlashcard
            flashcard={blankCard}
            onSuccess={() => LoadCards(cards.length)}
          />
        </ButtonModal>
      </div>
    );
  };

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

  return (
    <div className={styles.flashcardView}>
      <Title />
      <div className={styles.topButtons}>
        <Navigation />

        <div className={styles.topRightButtons}>
          <EditCard />
          <AddCard />
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
