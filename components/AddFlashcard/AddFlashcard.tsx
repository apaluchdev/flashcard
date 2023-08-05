"use client";

import styles from "./AddFlashcard.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IFlashcard } from "@/models/Flashcard";
import flashcardClient from "@/lib/flashcard-client";
import Status from "@/enums/status";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface AddFlashcardProps {
  flashcard: IFlashcard;
  onSuccess: Function;
}

const AddFlashcard: React.FC<AddFlashcardProps> = ({
  flashcard,
  onSuccess,
}) => {
  const router = useRouter();

  const [status, setStatus] = useState<Status>(Status.Pending);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    // If a flashcard is passed in, set the initial values
    if (flashcard) {
      setQuestion(flashcard.question);
      setAnswer(flashcard.answer);
      setTopic(flashcard.topic);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent refresh on submit

    const card: IFlashcard = {
      _id: flashcard._id,
      question: question,
      answer: answer,
      topic: topic,
      userId: flashcard.userId,
      topicId: flashcard.topicId,
    };

    try {
      setStatus(Status.Loading);

      let savedCard: IFlashcard = await flashcardClient.SaveFlashcard(card);

      setQuestion("");
      setAnswer("");
      setTopic("");

      setStatus(savedCard._id ? Status.Success : Status.Failure);

      if (Status.Success && flashcard._id) {
        router.push(`/flashcard/${savedCard.userId}/${savedCard.topicId}`);
      }

      onSuccess(); // TODO - Select new card on submit success
    } catch (error) {
      setStatus(Status.Failure);
      console.error(error);
    }
  };

  const Result = () => {
    if (!status) return;

    const Success = () => {
      return (
        <div className="alert alert-success">
          <strong>Success!</strong> Flashcard added.
        </div>
      );
    };

    const Failure = () => {
      return (
        <div className="alert alert-danger">
          <strong>Flashcard save failed.</strong>
        </div>
      );
    };

    if (status == Status.Success) return <Success />;
    if (status == Status.Failure) return <Failure />;
    if (status == Status.Loading)
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
  };

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
