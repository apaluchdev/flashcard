import { useState } from "react";
import styles from "./flip-card.module.css";
import CardFace from "./cardface";
import { Card } from "../ui/card";

interface SimpleComponentProps {
  question: string;
  answer: string;
  topic: string;
  isEditMode: boolean;
}

const FlipCard: React.FC<SimpleComponentProps> = ({
  question,
  answer,
  topic,
  isEditMode,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // if (isEditMode) setIsFlipped(true);

  return (
    <div
      className={`${styles.container}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* When not flipped, and not currently editing, lift the card slightly to the right */}
      {/* When flipped, and not editing, lift the card slightly to the left */}
      {/* When in edit mode or clicked - flip the card */}
      <Card
        className={`${styles.card} ${styles.cardHover} 
        
        ${!isFlipped && !isEditMode && styles.rightFlip}
        ${(isEditMode || isFlipped) && styles.isFlipped}`}
      >
        <div className={styles.front}>
          <CardFace question={question} answer={""} topic={topic} />
        </div>
        <div className={styles.back}>
          <CardFace question={question} answer={answer} topic={topic} />
        </div>
      </Card>
    </div>
  );
};

export default FlipCard;
