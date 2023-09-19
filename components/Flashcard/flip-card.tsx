import { useState } from "react";
import styles from "./flip-card.module.css";
import CardFace from "./cardface";
import { Card } from "../ui/card";

interface SimpleComponentProps {
  question: string;
  answer: string;
  isEditMode: boolean;
}

const FlipCard: React.FC<SimpleComponentProps> = ({
  question,
  answer,
  isEditMode,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  return (
    <div
      className={`${styles.container}`}
      onClick={() => !isEditMode && setIsFlipped(!isFlipped)}
    >
      <Card
        className={`${styles.card} ${styles.cardHover} ${
          isFlipped && styles.isFlipped
        }`}
      >
        <div className={styles.front}>
          <CardFace question={question} answer={answer} />
        </div>
        <div className={styles.back}>
          <CardFace question={question} answer={answer} />
        </div>
      </Card>
    </div>
  );
};

export default FlipCard;
