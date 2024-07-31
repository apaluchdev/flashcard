"use client";

import React, { useEffect, useState } from "react";
import { IFlashcard, shuffleFlashcards } from "@/models/Flashcard";
import { ITopic } from "@/models/Topic";
import Flashcard from "./flashcard";
import { useURLState } from "@/hooks/useURLState";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Edit,
  PlusSquare,
  Save,
  Shuffle,
  StepBack,
  StepForward,
  Trash2,
} from "lucide-react";
import DiscardDialog from "../discard-dialog/discard-dialog";
import { toast } from "../ui/use-toast";
import TextEditor from "../text-editor/text-editor";
import { Input } from "../ui/input";
import { Roboto } from "next/font/google";

const robotoStandard = Roboto({ subsets: ["latin"], weight: "400" });
const robotoBold = Roboto({ subsets: ["latin"], weight: "500" });

interface Props {
  flashcardsProp: IFlashcard[];
  topic: ITopic;
}

const FlashcardViewer: React.FC<Props> = ({ flashcardsProp, topic }) => {
  const setURLState = useURLState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCardIndex = parseInt(searchParams?.get("cardIndex") || "0");

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [cardIndex, setCardIndex] = useState<number>(urlCardIndex);
  const [flashcards, setFlashcards] = useState<IFlashcard[]>(flashcardsProp);
  const [flashcard, setFlashcard] = useState<IFlashcard | undefined>(
    flashcards && flashcards[urlCardIndex],
  );
  if (!flashcard) return <h1 className="text-6xl">No flashcards</h1>;

  async function onIndexChanged(newIndex: number) {
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= flashcards.length) newIndex = flashcards.length - 1;

    setFlashcard(flashcards[newIndex]);
    setCardIndex(newIndex);

    const urlUpdate = new Map([
      ["flipped", "false"],
      ["cardIndex", String(newIndex)],
    ]);

    setURLState(urlUpdate);

    console.log("Index changed to " + newIndex);
  }

  // Actions
  function onCopyToClipboard() {
    var copyTextHTML = `${flashcard?.answer ?? ""}`;
    var copyText = flashcard?.question ?? "" + " ";
    var tempElement = document.createElement("div");

    // Set the innerHTML of the temporary element to the given HTML string
    tempElement.innerHTML = copyTextHTML;

    // Get all child elements
    var elements = tempElement.children;

    // Loop through each element and get inner HTML
    for (var i = 0; i < elements.length; i++) {
      var innerHTML = elements[i].innerHTML;
      copyText = copyText.concat(innerHTML);
    }

    navigator.clipboard.writeText(copyText);
    toast({
      variant: "success",
      description: "Copied Flashcard to clipboard.",
    });
  }

  function onCancelEdit() {
    setIsEditMode(false);
  }

  function onShuffleFlashcards() {
    const shuffledCards = shuffleFlashcards(flashcards);
    setFlashcards(shuffledCards);
    setFlashcard(shuffledCards[0]);
  }

  function onAddCard() {
    const newFlashcard = {
      question: "",
      answer: "",
      topicId: topic._id,
      userId: "Adrian", // TODO - Fix me to be the actual userId!
    };

    //setFlashcards([...flashcards, newFlashcard as IFlashcard]);
    onIndexChanged(flashcards.length);
    setFlashcard(newFlashcard as IFlashcard);
    setURLState(new Map([["flipped", "true"]]));
    setIsEditMode(true);
  }

  function onEditCard() {
    const urlUpdate = new Map([["flipped", "true"]]);
    setURLState(urlUpdate);
    setIsEditMode(true);
  }

  async function onSaveCard() {
    const response = await fetch(`/api/flashcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flashcard),
    });
    const savedFlashcard: IFlashcard = (await response.json()).flashcard;
    const oldFlashcardIndex = flashcards.findIndex(
      (card) => card._id === savedFlashcard._id,
    );

    if (oldFlashcardIndex > -1) {
      flashcards[oldFlashcardIndex] = savedFlashcard;
      setFlashcards([...flashcards]);
    } else {
      flashcards.push(savedFlashcard);
      setFlashcard(flashcards[flashcards.length - 1]);
      setFlashcards([...flashcards]);
      onIndexChanged(flashcards.length - 1);
    }

    setIsEditMode(false);

    if (savedFlashcard)
      toast({
        variant: "success",
        description: "Flashcard saved!",
      });

    return savedFlashcard;
  }

  function PreviousAndNextButtons() {
    const isEdit = false;
    return (
      <div className="flex items-center gap-1">
        <Button
          disabled={isEdit}
          onClick={() => onIndexChanged(0)}
          className="w-10"
          variant="outline"
        >
          <StepBack className="absolute" />
        </Button>
        <Button
          disabled={isEdit}
          onClick={() => onIndexChanged(cardIndex - 1)}
          className="w-10"
          variant="outline"
        >
          <ChevronLeft className="absolute" />
        </Button>
        <Button
          disabled={isEdit}
          onClick={() => onIndexChanged(cardIndex + 1)}
          className="w-10"
          variant="outline"
        >
          <ChevronRight className="absolute" />
        </Button>
        <Button
          disabled={isEdit}
          onClick={() => onIndexChanged(Number.POSITIVE_INFINITY)}
          className="w-10"
          variant="outline"
        >
          <StepForward className="absolute" />
        </Button>
        <p className="min-w-12 text-right text-sm">
          {cardIndex + 1} / {flashcards.length}
        </p>
      </div>
    );
  }

  function MainCardButtons() {
    const userOwnsDeck = true;

    // TODO - Disallow users editing cards they don't own
    if (isEditMode)
      return (
        <div className="flex gap-2">
          <DiscardDialog onDiscard={onCancelEdit} onCancel={() => null} />
          <Button disabled={!userOwnsDeck} onClick={onSaveCard}>
            <Save />
          </Button>
        </div>
      );

    if (!isEditMode)
      return (
        <div className="flex gap-2">
          <DeleteButton />
          <Button
            disabled={!userOwnsDeck || isEditMode}
            onClick={onEditCard}
            className="w-15"
          >
            <Edit />
          </Button>
          <Button disabled={!userOwnsDeck || isEditMode} onClick={onAddCard}>
            <PlusSquare />
          </Button>
        </div>
      );
  }

  function AccessoryCardButtons() {
    const userOwnsDeck = true;

    if (!isEditMode)
      return (
        <div className="flex gap-2">
          <Button onClick={onCopyToClipboard}>
            <ClipboardCopy />
          </Button>
          <Button
            disabled={isEditMode}
            onClick={onShuffleFlashcards}
            className="w-15"
          >
            <Shuffle />
          </Button>
        </div>
      );
  }

  function DeleteButton() {
    const userOwnsDeck = true;

    async function DeleteCard() {
      // var isDeleted = await flashcardClient.DeleteFlashcardById(
      //   cards[cardIndex]._id || "",
      // );
      // if (isDeleted) {
      //   toast({
      //     variant: "success",
      //     description: "Flashcard deleted.",
      //   });
      //   LoadCards(Math.max(0, cardIndex - 1));
      // }
    }

    return (
      <Button
        className="w-15"
        disabled={!userOwnsDeck || isEditMode}
        onClick={DeleteCard}
        variant="destructive"
      >
        <Trash2 />
      </Button>
    );
  }

  return (
    <div className="mb-48 flex w-full flex-col items-center gap-8 pb-8 pt-8">
      <div className="flex h-[460px] w-5/6 max-w-[800px] flex-col gap-4">
        <div className="flex justify-between">
          <AccessoryCardButtons />
        </div>
        <Flashcard flashcard={flashcard} topicTitle={topic.topicTitle} />
        <div className="flex justify-between">
          <MainCardButtons />
          <PreviousAndNextButtons />
        </div>
      </div>

      {/* TODO Rework the text editor */}
      <div className="max-h-96 w-5/6 max-w-[800px]">
        {isEditMode && (
          <div className="flex flex-col gap-6 rounded-lg border border-gray-400 p-8">
            <div className="flex flex-col gap-2">
              <h1 className={`${robotoBold.className} text-xl`}>Question:</h1>
              <Input
                className={`${robotoStandard.className} text-lg font-bold`}
                autoFocus
                type="text"
                placeholder="Question"
                value={flashcard.question}
                onChange={(event) => {
                  setFlashcard({ ...flashcard, question: event.target.value });
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className={`${robotoBold.className} text-xl`}>Answer:</h1>
              <TextEditor
                initialText={flashcard.answer}
                TextEditorCallback={(answer: string) =>
                  setFlashcard({ ...flashcard, answer: answer })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardViewer;
