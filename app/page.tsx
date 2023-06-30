import styles from "./page.module.css";
import FlashCard from "@/components/flashcard/FlashCard";
import Modal from "@/components/modal/Modal";

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

export default function Page() {
  return (
    <main className={styles.main}>
      {/* Title and topic  */}
      <div>
        <h3 style={{ textAlign: "left" }}>Current Topic:</h3>
        <h1 style={{ fontSize: 64, color: "#802424" }}>CompTIA Security+</h1>
      </div>

      <div className={styles.content}>
        <FlashCard />
        <Modal>
          <h1>Modal Content goes here...</h1>
        </Modal>
        {/* <button onClick={handleFlashcardDelete}>Click me!</button> */}
      </div>
    </main>
  );
}
