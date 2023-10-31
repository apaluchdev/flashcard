import { IFlashcard } from "@/models/Flashcard";
import TextViewer from "../text-viewer/text-viewer";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface CardFaceProps {
  flashcard: IFlashcard;
}

const CardFace: React.FC<CardFaceProps> = ({ flashcard }) => {
  return (
    <div className="w-full">
      <CardHeader className="text-center">
        <CardDescription>
          {decodeURIComponent(flashcard?.topic || "")}
        </CardDescription>
        <CardTitle className="whitespace-normal break-words text-xl md:text-4xl">
          {/* Override long questions to use text-xl */}
          <div
            className={`${
              (flashcard?.question?.length ?? 0) > 100 && "text-xl"
            }`}
          >
            {flashcard?.question}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <TextViewer text={flashcard?.answer} />
      </CardContent>
      <CardFooter></CardFooter>
    </div>
  );
};

export default CardFace;
