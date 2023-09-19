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
}

const CardFace: React.FC<CardFaceProps> = ({ question, answer }) => {
  return (
    <div className="w-full">
      <CardHeader className="text-center text-4xl">
        <CardTitle>{question}</CardTitle>
        <CardDescription>Front</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <TextViewer text={answer} />
      </CardContent>
      <CardFooter></CardFooter>
    </div>
  );
};

export default CardFace;
