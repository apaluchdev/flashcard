"use client";

import styles from "./page.module.css";
import FlashCard from "@/components/FlashCard";
import Modal from "@/components/Modal";

interface PageProps {
  params: { flashcardid: string };
}

const handleFlashcardDelete = async () => {
  try {
    const response = await fetch("/api/flashcard/123", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers as needed
      },
    });
  } catch (error) {
    console.error("An error occurred while deleting the item:", error);
  }
};

export default async function Page({ params: { flashcardid } }: PageProps) {
  return (
    <main className={styles.main}>
      {/* Title and topic  */}
      {flashcardid}
    </main>
  );
}
