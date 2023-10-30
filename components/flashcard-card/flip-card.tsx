import styles from "./flip-card.module.css";
import CardFace from "./cardface";
import { Card } from "../ui/card";
import { IFlashcard } from "@/models/Flashcard";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  flashcard: IFlashcard;
  isEditMode: boolean;
}

const FlipCard: React.FC<Props> = ({ flashcard, isEditMode }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFlipped = searchParams.get("flipped") == "true";
  const cardIndex = searchParams.get("cardIndex") || "0";
  function handleClick() {
    if (isEditMode && isFlipped) return;

    router.push(
      `?cardIndex=${cardIndex}&flipped=${!(
        searchParams.get("flipped") == "true"
      )}`,
      {
        scroll: false,
      },
    );
  }

  return (
    <div className={`${styles.container}`} onClick={handleClick}>
      <Card
        className={`         
        ${styles.card}       
        ${!isFlipped && !isEditMode && styles.rightFlip} 
        ${(isEditMode || isFlipped) && styles.isFlipped}
        `}
      >
        {!isFlipped ? (
          <div className={styles.front}>
            <CardFace flashcard={{ ...flashcard, answer: "" }} />
          </div>
        ) : (
          <div className={`${styles.back}`}>
            <CardFace flashcard={flashcard} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default FlipCard;
