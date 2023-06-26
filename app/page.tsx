import Image from "next/image";
import styles from "./page.module.css";
import FlashCard from "@/components/FlashCard";

function HelloWorld() {
  console.log("Hello World");
}

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Title and topic  */}
      <div>
        <h3 style={{ textAlign: "left" }}>Current Topic:</h3>
        <h1 style={{ fontSize: 64, color: "#802424" }}>CompTIA Security+</h1>
      </div>

      <div className={styles.content}>
        {/* FlashCard */}
        <FlashCard />
      </div>
    </main>
  );
}
