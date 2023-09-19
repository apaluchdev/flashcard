"use client";

import React, { ReactNode, createContext, useEffect, useState } from "react";
import TextEditor from "../text-editor/text-editor";
import { Open_Sans, Roboto } from "next/font/google";

import { Button } from "../ui/button";
import flashcardClient from "@/lib/flashcard-client";
import { IFlashcard } from "@/models/Flashcard";
import { ITopic } from "@/models/Topic";
import AddDeck from "../add-deck/add-deck";
import { toast } from "../ui/use-toast";
import topicClient from "@/lib/topic-client";
import FlipCard from "./flip-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import DiscardDialog from "../discard-dialog/discard-dialog";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  userId: string;
  topic: string;
}

const Flashcard: React.FC<Props> = ({ userId, topic }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [cards, setCards] = useState<IFlashcard[]>([]);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [change, setChange] = useState<boolean>(false);
  const [card, setCard] = useState<IFlashcard | undefined>(undefined);

  useEffect(() => {
    const GetData = async () => {
      await LoadCards();
    };

    GetData();
  }, []);

  function onQuestionEdit(event: { target: { value: any } }) {
    cards[cardIndex].question = event.target.value;
    setChange(!change);
  }

  function onAnswerEdit(answer: string) {
    cards[cardIndex].answer = answer;
    setChange(!change);
  }

  async function LoadCards(index: number = 0) {
    let cards: IFlashcard[] =
      await flashcardClient.GetFlashcardsByUserIdAndTopicAsync(userId, topic);

    setCards(cards.sort((a, b) => ((a.order || 0) > (b.order || 0) ? 1 : -1)));
    setCardIndex(index);
    setCard(cards[cardIndex])
  }

  async function AddCard() {
    const newCard: IFlashcard = {
      question: "",
      answer: "",
      topicId: "",
      userId: userId,
    };
    cards.push(newCard);
    setCardIndex(cards.length - 1);
    setIsEdit(true);
  }

  function EditCard() {
    setIsEdit(true);
  }

  async function onSaveCard() {
    cards[cardIndex].topicId = (
      await topicClient.GetTopicByUserIdAndTopic(userId, topic)
    )?._id;
    const result = await flashcardClient.SaveFlashcard(cards[cardIndex]);

    if (result) {
      setIsEdit(false);
      cards.pop();
      cards.push(result);
      setCards(cards);

      toast({
        description: "Flashcard saved!",
      });
    } else {
      toast({
        variant: "destructive",
        description: "An error occurred.",
      });
    }
  }

  function onCancelEdit() {
    setIsEdit(false);

    // If card has topicId, it must have been an edit
    if (cards[cardIndex].topicId) return;

    // Cancelled adding a card, remove it
    setCardIndex(cardIndex - 1);
    setCards(cards.slice(0, -1));
  }

  function DeleteButton() {
    async function DeleteCard() {
      var isDeleted = await flashcardClient.DeleteCard(
        cards[cardIndex]._id || "",
      );
      if (isDeleted) LoadCards(cardIndex - 1 < 0 ? 0 : cardIndex - 1);
    }

    return (
      <Button
        className="w-28"
        disabled={isEdit}
        onClick={DeleteCard}
        variant="destructive"
      >
        Delete
      </Button>
    );
  };

  function ShuffleCards() {
    if (!cards) return;
    let shuffledCards = cards.concat([]);

    // Keep shuffling if the first card doesn't change, otherwise users will think nothing happened.
    while (cards[0] == shuffledCards[0]) {
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
        [shuffledCards[i], shuffledCards[j]] = [
          shuffledCards[j],
          shuffledCards[i],
        ]; // Swap elements at indices i and j
      }
    }
    setCards(shuffledCards);
    setCardIndex(0);
  }

  function NextCard() {
    setCardIndex(
      cardIndex >= cards.length - 1 ? cards.length - 1 : cardIndex + 1,
    );
  }

  function PreviousCard() {
    setCardIndex(cardIndex < 1 ? 0 : cardIndex - 1);
  }

  if (!cards || cards.length < 1) {
    // and !loading
    return (
      <div
        className={`${roboto.className} mb-36 flex h-full w-4/6 max-w-3xl flex-col items-center justify-center gap-10 text-4xl tracking-tight`}
      >
        <h1>No cards found!</h1>
        <Button disabled={isEdit} onClick={AddCard} className="w-28">
          Add Card
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`${roboto.className} mb-36 flex h-full w-4/6 max-w-3xl flex-col items-center justify-center gap-6`}
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full justify-start gap-3">
          <AddDeck />
        </div>
        <div className="flex w-full justify-end gap-3">
          <Button disabled={isEdit} onClick={ShuffleCards} className="w-28">
            Shuffle
          </Button>
          <Button disabled={isEdit} onClick={EditCard} className="w-28">
            Edit Card
          </Button>
        </div>
      </div>

      {/* Card  */}
      <FlipCard
        question={cards[cardIndex].question}
        answer={cards[cardIndex].answer}
        isEditMode={isEdit}
      />

      {/* Bottom Buttons  */}
      <div className="flex w-full justify-between gap-1">
        {/* Previous and Next Buttons  */}
        <div className="flex w-full justify-start gap-3">
          <Button
            disabled={isEdit}
            onClick={PreviousCard}
            className="w-20"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={isEdit}
            onClick={NextCard}
            className="w-20"
            variant="outline"
          >
            Next
          </Button>
        </div>

        {/* Add and Delete Buttons  */}
        <div className="flex w-full justify-end gap-3">
          <Button disabled={isEdit} onClick={AddCard} className="w-28">
            Add Card
          </Button>
          <DeleteButton />
        </div>
      </div>

      {/* Edit Mode Text Area */}
      {isEdit && (
        <div className="flex h-64 w-full flex-col justify-between gap-5">
          <Input
            type="text"
            placeholder="Question"
            value={cards[cardIndex].question}
            onChange={onQuestionEdit}
          />
          <TextEditor TextEditorCallback={onAnswerEdit} />
          <div className="mt-16 flex w-full justify-end gap-3">
            <DiscardDialog onDiscard={onCancelEdit} onCancel={() => null} />
            <Button onClick={onSaveCard} className="w-28">
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
