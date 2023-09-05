"use client";

import flashcardClient from "@/lib/flashcard-client";
import styles from "./RenameTopic.module.css";
import { useState, ReactNode } from "react";

interface ParentComponentProps {
  topicId: string;
  topicName: string;
}

const RenameTopic: React.FC<ParentComponentProps> = ({
  topicId,
  topicName,
}) => {
  const [newTopicName, setNewTopicName] = useState<string>(topicName);

  async function RenameTopic() {
    const result = await flashcardClient.RenameTopic(
      newTopicName,
      topicId ?? ""
    );
  }

  return (
    <div>
      <h1 className="">Rename Topic</h1>
      <form className={styles.renameForm} onSubmit={RenameTopic}>
        <input
          className={styles.topicInput}
          type="text"
          required
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
        />
        <button className={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default RenameTopic;
