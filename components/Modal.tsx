"use client";

import React from "react";
import Image from "next/image";
import styles from "./Modal.module.css";
import { useState, useEffect } from "react";

// reactstrap components

function Modal() {
  const [isVisible, setVisibility] = useState(false);

  function ToggleVisibility() {
    setMessage("");
    setVisibility(!isVisible);
  }
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
      const response = await fetch("/api/flashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          answer: answer,
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
      <button className={styles.button} onClick={ToggleVisibility}>
        Add Flashcard
      </button>

      {isVisible && (
        <div id="myModal" className={styles.modal}>
          <div className={styles.modalContent}>
            <button onClick={ToggleVisibility} className={styles.close}>
              &times;
            </button>
            <div
              id="test"
              className={styles.flashCardForm}
              // action="/api/flashcard"
              // method="post"
            >
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
              <button
                onClick={handlePost}
                className={styles.button}
                type="submit">
                Submit
              </button>
            </div>
            <p>
              {isLoading && <LoadingSpinner />}
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
