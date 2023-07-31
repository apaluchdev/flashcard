"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./AddFlashcard.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
const { v4: uuidv4 } = require("uuid");

interface AddFlashcardProps {
  topicId: string;
  userId: string;
  topicTitle: string;
  onSuccess: Function;
  cards: Flashcard[];
}

const AddFlashcard: React.FC<AddFlashcardProps> = ({
  topicId,
  userId,
  topicTitle,
  onSuccess,
  cards,
}) => {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  var guid = uuidv4();

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent refresh on submit

    guid = uuidv4();

    const flashcard = {
      question: question,
      answer: answer,
      userId: userId,
      topicId: guid,
      topic: topic,
      order: 0,
    };
    try {
      // Indicate that a save is being performed
      setIsLoading(true);
      setMessage("");
      // Save request
      const response = await fetch(`/api/flashcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flashcard),
      });

      let responseBody = await response.json();
      topicId = responseBody.result.insertedId;

      if (response.ok && topicId) {
        setMessage("Success");
        setQuestion("");
        setAnswer("");
      } else if (response.ok && !guid) {
      } else {
        setMessage("Failure");
      }
    } catch (error) {
      setMessage("Sorry! A failure occurred.");
      console.error(error);
    }

    // Reload cards, and select the newly added card
    onSuccess(cards.length - 1); // This causes the entire page to reload and closes the modal, find a better way to keep modal open and do not refresh the whole page

    if (!topicTitle) {
      router.push(`/flashcard/${userId}/${guid}`);
    }
    setIsLoading(false);
  };

  const Result = () => {
    if (!message) return;

    const Success = () => {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> Flashcard added.
        </div>
      );
    };

    const Failure = () => {
      return (
        message && (
          <div className="alert alert-danger">
            <strong>Flashcard save failed.</strong>
          </div>
        )
      );
    };

    if (message == "Success") return <Success />;
    else return <Failure />;
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
        <div className={styles.topicTitle}>{topicTitle}</div>
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

      <Result />
    </form>
  );
};

export default AddFlashcard;
