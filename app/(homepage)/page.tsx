"use client";

import "./styles.css";
import Link from "next/link";
import ButtonModal from "@/components/ButtonModal/ButtonModal";
import AddFlashcard from "@/components/AddFlashcard/AddFlashcard";
import { IFlashcard } from "@/models/Flashcard";
import { useEffect, useState } from "react";
import flashcardClient from "@/lib/flashcard-client";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [topic, setTopic] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    setLoading(false);
  }, []);
  let newTopicFlashcard: IFlashcard = {
    topic: "",
    question: "",
    answer: "",
  };

  // async function GenerateDeck() {
  //   setStatus("");
  //   setLoading(true);
  //   let result = await flashcardClient.GenerateDeck(topic, "medium");
  //   setLoading(false);

  //   if (result.userId && result.topicId)
  //     router.push(`/flashcard/${result.userId}/${result.topicId}`);
  //   else {
  //     setStatus("Failed generation likely due to bad AI response, try again.");
  //   }
  // }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center`}>
      <Title />
      <div className="mt-12 flex flex-col gap-5 fade-in">
        <Button>Sign in</Button>
        <Button>Continue as Guest</Button>
      </div>

      {/* <div className={styles.buttons}>
          <ButtonModal text="Add Deck">
            <div>
              <AddFlashcard
                flashcard={newTopicFlashcard}
                onSuccess={() => {}}
              />
            </div>
          </ButtonModal>
          <Link className={styles.button} href="/topics">
            Find Decks
          </Link>
        </div> */}
      {/* <hr
          style={{
            marginTop: "100px",
            border: "none",
            width: "100%",
            height: "1px",
            backgroundColor: "black",
          }}
        >
          
        </hr>
        <div className={styles.generate}>
          <h1>Generate a deck using AI</h1>
          <p className={styles.preview}>! Work in progess preview !</p>
          <div className={styles.genPrompt}>
            <h3 className={styles.enterTopicHeader}>Enter a topic:</h3>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={styles.aiInput}
            ></input>
            <button onClick={GenerateDeck} className={styles.button}>
              Generate
            </button>
            <div className={styles.loading}>
              {isLoading && <LoadingSpinner />}
              {status}
            </div>
          </div>
        </div> */}
    </main>
  );
}

export const Title = () => {
  return (
    <div className="mb-12">
      <h1 className="text-center text-8xl tracking-tighter text-gray-700 fade-in">
        Flashcards
      </h1>
      <h1 className=" text-7xl tracking-tighter text-gray-500">
        <span className="fade-in-delay-1 text-theme-3">Study</span>
        <span className="fade-in-delay-1 text-6xl">. </span>
        <span className="fade-in-delay-2 text-theme-2">Flip</span>
        <span className="fade-in-delay-2 text-6xl">. </span>
        <span className="fade-in-delay-3 text-theme-1">Learn</span>
        <span className="fade-in-delay-3 text-6xl">. </span>
      </h1>
    </div>
  );
};
