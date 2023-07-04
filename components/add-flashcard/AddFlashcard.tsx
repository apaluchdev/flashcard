"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./AddFlashcard.module.css";
import { useState } from "react";

interface AddFlashcardProps {
  topicId: string;
  userId: string;
  onSuccess: Function;
  cards: Flashcard[];
}

const AddFlashcard: React.FC<AddFlashcardProps> = ({
  topicId,
  userId,
  onSuccess,
  cards,
}) => {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function LoadingSpinner() {
    return (
      <div
        style={{ marginTop: "2rem" }}
        className="spinner-border"
        role="status"></div>
    );
  }

  const handlePost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.BASE_URL}/api/flashcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          answer: answer,
          userId: userId, // Probably use a global context for userId once we setup OAuth
          topicId: topicId,
          /* your request payload */
        }),
      });

      if (response.ok) {
        setMessage("Success");

        setQuestion("");
        setAnswer("");
      } else {
        setMessage("Failure");
      }
    } catch (error) {
      setMessage("Sorry! A failure occurred.");
      console.error(error);
    }

    // Reload cards, and select the newly added card
    onSuccess(cards.length); // This causes the entire page to reload and closes the modal, find a better way to keep modal open and do not refresh the whole page

    setIsLoading(false);
  };

  const handleInputChangeQuestion = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestion(e.target.value);
  };

  const handleInputChangeAnswer = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAnswer(e.target.value);
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ minHeight: "355px" }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div id="test" className={styles.flashCardForm}>
          {message}
          <label className={styles.label} htmlFor="question">
            <div>Question:</div>
          </label>
          <input
            className={styles.question}
            type="text"
            id="question"
            name="question"
            value={question}
            onChange={handleInputChangeQuestion}
          />

          <label className={styles.label} htmlFor="answer">
            Answer:
          </label>
          <textarea
            draggable="false"
            className={styles.answer}
            id="answer"
            name="answer"
            value={answer}
            onChange={handleInputChangeAnswer}
          />

          <button onClick={handlePost} className={styles.button} type="submit">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFlashcard;
