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
      <CardHeader className="w-full text-center">
        <CardDescription>{topic}</CardDescription>
        <CardTitle className="whitespace-normal break-words text-4xl">
          {question}
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
