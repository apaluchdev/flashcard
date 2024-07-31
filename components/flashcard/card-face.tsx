import { IFlashcard } from "@/models/Flashcard";
import { Roboto } from "next/font/google";
import TextViewer from "../text-viewer/text-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { use, useEffect, useRef, useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

interface CardFaceProps {
  flashcard: IFlashcard;
  topicTitle: string;
}

const CardFace: React.FC<CardFaceProps> = ({ flashcard, topicTitle }) => {
  const [titleHeight, setTitleHeight] = useState<number>(0);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleHeight(titleRef.current?.clientHeight ?? 0);
  }, []);

  // Temporarily hide the answer when the card changes so that the answer is not revealed during the flip animation
  useEffect(() => {
    const htmlDiv = answerRef.current;

    if (!htmlDiv) return;

    htmlDiv.style.opacity = "0";

    const timer = setTimeout(() => {
      htmlDiv.style.opacity = "1";
    }, 250);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [flashcard._id]);

  return (
    <Card
      className={`${roboto.className} flex h-full w-full flex-col items-center overflow-scroll p-4`}
    >
      <div className="flex w-full flex-col text-center">
        <div
          ref={titleRef}
          className={`whitespace-normal break-words font-bold ${titleHeight > 180 ? "text-1xl" : "text-2xl"} mb-0 pb-0`}
        >
          <h3 className="text-sm font-normal text-gray-500">
            {topicTitle ?? "Error loading topic"}
          </h3>
          {flashcard?.question}
        </div>
      </div>
      <div ref={answerRef}>
        <TextViewer text={flashcard?.answer} />
      </div>
    </Card>
  );
};

export default CardFace;
