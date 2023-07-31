"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./AddFlashcard.module.css";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent refresh on submit

    const flashcard = { question, answer, userId, topicId };
    try {
      // Indicate that a save is being performed
      setIsLoading(true);

      // Save request
      const response = await fetch(`/api/flashcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flashcard),
      });


      if (response.ok && topicId) {
        setMessage("Success");
        setQuestion("");
        setAnswer("");
      } else if (response.ok && !topicId) {

      }     
      else {
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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Add Flashcard</h1>

      {/* Topic Input */}
      <label className={styles.label}>Topic</label>

      {!topicId ? (
        <input
          className={styles.topicInput}
          type="text"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      ) : (
        topicId
      )}

      {/* Question Input */}
      <label className={styles.label}>Question</label>
      <input
        className={styles.questionInput}
        type="text"
        required
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Answer Input  */}
      <label className={styles.label}>Answer</label>
      <textarea
        className={styles.answerInput}
        required
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}></textarea>

      <button className={styles.button}>Submit</button>
    </form>
  );
};

export default AddFlashcard;
