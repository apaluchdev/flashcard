"use client";

import styles from "./AddFlashcard.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IFlashcard } from "@/models/Flashcard";

interface AddFlashcardProps {
  flashcard: IFlashcard;
  onSuccess: Function;
}

const AddFlashcard: React.FC<AddFlashcardProps> = ({
  flashcard,
  onSuccess,
}) => {
  const router = useRouter();

  const [message, setMessage] = useState("");
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
      question: question,
      answer: answer,
      topic: topic,
      userId: flashcard.userId,
      topicId: flashcard.topicId,
    };

    try {
      setMessage("");

      // Save request
      const response = await fetch(`/api/flashcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });

      let result = (await response.json()).savedFlashcard;

      //flashcard._id = new ObjectId(result.upsertedId);

      setQuestion("");
      setAnswer("");
      setTopic("");

      setMessage(response.ok && result._id ? "Success" : "Failure");
    } catch (error) {
      setMessage("Sorry! A failure occurred.");
      console.error(error);
    }

    onSuccess(); // TODO - Select new card on submit success

    if (message === "Success") {
      router.push(`/flashcard/${card.userId}/${card.topicId}`);
    }
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
