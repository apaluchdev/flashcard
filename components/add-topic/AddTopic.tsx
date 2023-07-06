"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./AddTopic.module.css";
const { v4: uuidv4 } = require("uuid");

interface FormValues {
  topic: string;
  question: string;
  answer: string;
}

const AddTopic = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [formValues, setFormValues] = useState<FormValues>({
    topic: "",
    question: "",
    answer: "",
  });

  const handlePost = async () => {
    try {
      setIsLoading(true);

      const guid = uuidv4();

      const response = await fetch(`/api/flashcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          answer: answer,
          topic: topic,
          userId: "test", // Probably use a global context for userId once we setup OAuth
          topicId: guid,
          /* your request payload */
        }),
      });

      if (response.ok) {
        setMessage("Success");

        router.push(`/flashcard/test/${guid}`);
        //     setQuestion("");
        //     setAnswer("");
        //   } else {
        //     setMessage("Failure");
        //   }
        // } catch (error) {
        //   setMessage("Sorry! A failure occurred.");
        //   console.error(error);
      }

      // Reload cards, and select the newly added card

      setIsLoading(false);
    } catch (error) {}
  };

  function LoadingSpinner() {
    return (
      <div
        style={{ marginTop: "2rem" }}
        className="spinner-border"
        role="status"></div>
    );
  }

  const handleInputChangeTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
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
        <div className={styles.flashCardForm}>
          {message}
          <label className={styles.label}>
            <div style={{ fontWeight: "1000" }}>New Topic:</div>
          </label>
          <input
            className={styles.question}
            type="text"
            name="topic"
            value={topic}
            onChange={handleInputChangeTopic}
          />
          <label className={styles.label}>
            <div>Question:</div>
          </label>
          <input
            className={styles.question}
            type="text"
            name="question"
            value={question}
            onChange={handleInputChangeQuestion}
          />
          <label className={styles.label}>Answer:</label>
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

export default AddTopic;
