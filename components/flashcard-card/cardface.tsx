import TextViewer from "../text-viewer/text-viewer";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface CardFaceProps {
  question: string;
  answer: string;
  topic: string;
}

const CardFace: React.FC<CardFaceProps> = ({ question, answer, topic }) => {
  return (
    <div className="w-full">
      <CardHeader className="text-center">
        <CardDescription>{decodeURIComponent(topic)}</CardDescription>
        <CardTitle className="whitespace-normal break-words text-xl md:text-4xl">
          {/* Override long questions to use text-xl */}
          <div className={`${question.length > 100 && "text-xl"}`}>
            {question}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <TextViewer text={answer} />
      </CardContent>
      <CardFooter></CardFooter>
    </div>
  );
};

export default CardFace;
