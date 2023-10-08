import { useEffect, useRef, useState } from "react";
import styles from "./flip-card.module.css";
import CardFace from "./cardface";
import { Card } from "../ui/card";
import { IFlashcard } from "@/models/Flashcard";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  flashcard: IFlashcard;
  isEditMode: boolean;
  onFlipCompleted: Function;
}

const FlipCard: React.FC<Props> = ({
  flashcard,
  isEditMode,
  onFlipCompleted,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const cardIndex = useRef<number>(0);

  useEffect(() => {
    if (!isFlipped) onFlipCompleted();
  }, [isFlipped]);

  if (cardIndex.current != parseInt(searchParams.get("cardIndex") || "0")) {
    setIsFlipped(false);
    onFlipCompleted();
  }

  cardIndex.current = parseInt(searchParams.get("cardIndex") || "0");

  return (
    <div
      className={`${styles.container}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* When not flipped, and not currently editing, lift the card slightly to the right */}
      {/* When flipped, and not editing, lift the card slightly to the left */}
      {/* When in edit mode or clicked - flip the card */}
      {/* ${!isFlipped && styles.fastFlip} */}
      <Card
        className={`         
        ${styles.card}       
        ${!isFlipped && !isEditMode && styles.rightFlip}
        ${(isEditMode || isFlipped) && styles.isFlipped}
        `}
      >
        <div className={styles.front}>
          <CardFace
            question={flashcard.question}
            answer={""}
            topic={flashcard.topic || ""}
          />
        </div>
        <div className={`${styles.back}`}>
          {(isFlipped || isEditMode) && (
            <CardFace
              question={flashcard.question}
              answer={flashcard.answer}
              topic={flashcard.topic || ""} // make this accept IFlashcard too
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default FlipCard;
