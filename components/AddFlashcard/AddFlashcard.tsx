"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./AddFlashcard.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface AddFlashcardProps {
  flashcard: Flashcard;
  onSuccess: Function;
}

const AddFlashcard: React.FC<AddFlashcardProps> = ({
  flashcard,
  onSuccess,
}) => {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent refresh on submit

    // Assign a new topic id if not already assigned
    if (!flashcard.topicId) flashcard.topicId = uuid();

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
      let _id = responseBody.result.insertedId;

      if (response.ok && _id) {
        setMessage("Success");

        // Clear fields
        setQuestion("");
        setAnswer("");
      } else {
        setMessage("Failure");
      }
    } catch (error) {
      setMessage("Sorry! A failure occurred.");
      console.error(error);
    }

    onSuccess(); // TODO - Select new card on submit success

    if (message === "Success") {
      router.push(`/flashcard/${flashcard.userId}/${flashcard.topicId}`);
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Add Flashcard</h1>

      {/* Topic Input */}
      <label className={styles.label}>Topic</label>

      {/* If the flashcard passed in does not have a topic, it means a new topic is being created */}
      {!flashcard.topicId ? (
        <input
          className={styles.topicInput}
          type="text"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      ) : (
        <div className={styles.topicTitle}>{flashcard.topic}</div>
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

      {/* Submit Button  */}
      <button className={styles.button}>Submit</button>

      {/* Display Submit Results  */}
      <Result />
    </form>
  );
};

export default AddFlashcard;
