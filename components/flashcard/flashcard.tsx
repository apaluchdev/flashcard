import { IFlashcard } from "@/models/Flashcard";
import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useURLState } from "@/hooks/useURLState";
import CardFace from "./card-face";

interface FlashcardProps {
  flashcard: IFlashcard;
  topicTitle: string;
}

interface Props {
  children: ReactNode;
}

const Front: React.FC<Props> = ({ children }) => {
  return <div className="absolute inset-0">{children}</div>;
};

const Back: React.FC<Props> = ({ children }) => {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
      {children}
    </div>
  );
};

const Flashcard: React.FC<FlashcardProps> = ({ flashcard, topicTitle }) => {
  const searchParams = useSearchParams();
  const setURLState = useURLState();
  const isFlipped = searchParams?.get("flipped") === "true";

  function onFlip() {
    setURLState(new Map([["flipped", String(!isFlipped)]]));
  }

  return (
    <div className="group h-full min-h-8 w-full min-w-8 cursor-pointer [perspective:1000px]">
      <div
        onClick={onFlip}
        className={`relative h-full w-full shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${isFlipped && "[transform:rotateY(180deg)]"}`}
      >
        <Front>
          <CardFace
            flashcard={{ ...flashcard, answer: "" }}
            topicTitle={topicTitle}
          />
        </Front>
        <Back>
          <CardFace flashcard={flashcard} topicTitle={topicTitle} />
        </Back>
      </div>
    </div>
  );
};

export default Flashcard;
