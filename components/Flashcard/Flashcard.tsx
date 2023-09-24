"use client";

import React, { useEffect, useRef, useState } from "react";
import TextEditor from "../text-editor/text-editor";
import { Roboto } from "next/font/google";
import { Button } from "../ui/button";
import flashcardClient from "@/clients/flashcard-client";
import { IFlashcard } from "@/models/Flashcard";
import AddDeck from "../add-deck/add-deck";
import { toast } from "../ui/use-toast";
import topicClient from "@/clients/topic-client";
import FlipCard from "./flip-card";
import { Input } from "../ui/input";
import DiscardDialog from "../discard-dialog/discard-dialog";
import LoadingSpinner from "../loading-spinner/loading-spinner";

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
  const [card, setCard] = useState<IFlashcard>({ question: "", answer: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const cards = useRef<IFlashcard[]>([]);
  const cardIndex = useRef<number>(0);
  const originalCard = useRef<IFlashcard>({ question: "", answer: "" }); // Used to revert edits

  useEffect(() => {
    const GetData = async () => {
      await LoadCards();
    };

    GetData();
  }, []);

  function onQuestionEdit(event: { target: { value: any } }) {
    setCard({ ...card, question: event.target.value });
  }

  function onAnswerEdit(answer: string) {
    setCard({ ...card, answer: answer });
  }

  async function LoadCards(index: number = 0) {
    let data: IFlashcard[] =
      await flashcardClient.GetFlashcardsByUserIdAndTopicTitleAsync(
        userId,
        topic,
      );

    cards.current = data.sort((a, b) =>
      (a.order || 0) > (b.order || 0) ? 1 : -1,
    );

    cardIndex.current = index;
    setCard(cards.current[cardIndex.current]);
    setLoading(false);
  }

  async function AddCard() {
    const newCard: IFlashcard = {
      question: "",
      answer: "",
      topicId: "",
      userId: userId,
    };
    setIsEdit(true);
    setCard(newCard);
  }

  function EditCard() {
    setIsEdit(true);
    originalCard.current = card;
  }

  async function onSaveCard() {
    const isNewCard = card.topicId ? false : true;

    if (isNewCard)
      card.topicId = (
        await topicClient.GetTopicByUserIdAndTopicTitle(userId, topic)
      )?._id;

    const result = await flashcardClient.UpsertFlashcard(card);

    if (result) {
      if (!isNewCard) {
        cards.current.pop(); // Remove old card
        cards.current.push(result); // Add updated card
      } else {
        LoadCards(cards.current.length);
      }
      setIsEdit(false);
      setCard(result);
      toast({
        variant: "success",
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

    setCard(originalCard.current);
    // If card has topicId, it must have been an edit
    if (card.topicId) return;

    // Cancelled adding a card, remove it
    setCard(cards.current[cards.current.length - 1]);
  }

  function DeleteButton() {
    async function DeleteCard() {
      var isDeleted = await flashcardClient.DeleteFlashcardById(card._id || "");
      if (isDeleted) {
        toast({
          variant: "success",
          description: "Flashcard deleted.",
        });
        LoadCards(Math.max(0, cardIndex.current - 1));
      }
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
  }

  function ShuffleCards() {
    if (!cards || cards.current.length < 2) return;
    let shuffledCards = cards.current.concat([]);

    // Keep shuffling if the first card doesn't change, otherwise users will think nothing happened.
    while (cards.current[0] == shuffledCards[0]) {
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
        [shuffledCards[i], shuffledCards[j]] = [
          shuffledCards[j],
          shuffledCards[i],
        ]; // Swap elements at indices i and j
      }
    }
    cards.current = shuffledCards;
    cardIndex.current = 0;
    setCard(cards.current[0]);
  }

  function NextCard() {
    cardIndex.current = Math.min(
      cardIndex.current + 1,
      cards.current.length - 1,
    );
    setCard(cards.current[cardIndex.current]);
  }

  function PreviousCard() {
    cardIndex.current = Math.max(0, cardIndex.current - 1);
    setCard(cards.current[cardIndex.current]);
  }

  if (loading)
    return (
      <div className="flex h-full w-4/6 max-w-3xl flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!isEdit && (!cards || cards.current.length < 1)) {
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
      className={`${roboto.className} mb-36 flex h-full w-4/6 max-w-3xl flex-col items-center justify-center gap-6 text-2xl`}
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
        question={card.question}
        answer={card.answer}
        topic={topic || ""}
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
          <p className="ml-3 mt-1 text-lg">
            {cardIndex.current + 1} / {cards.current.length}
          </p>
        </div>

        {/* Add and Delete Buttons  */}

        <div className="flex w-full justify-end gap-3">
          {isEdit ? (
            <DiscardDialog onDiscard={onCancelEdit} onCancel={() => null} />
          ) : (
            <DeleteButton />
          )}
          {isEdit ? (
            <Button onClick={onSaveCard} className="mt-1 w-28">
              Submit
            </Button>
          ) : (
            <Button disabled={isEdit} onClick={AddCard} className="w-28">
              Add Card
            </Button>
          )}
        </div>
      </div>

      {/* Edit Mode Area */}
      {isEdit && (
        <div className="flex w-full flex-col justify-between gap-5">
          <Input
            autoFocus
            type="text"
            placeholder="Question"
            value={card.question}
            onChange={onQuestionEdit}
          />
          <TextEditor
            TextEditorCallback={onAnswerEdit}
            initialText={card.answer}
          />

          {/* <div className="flex w-full justify-end gap-3">
            <DiscardDialog onDiscard={onCancelEdit} onCancel={() => null} />
            <Button onClick={onSaveCard} className="w-28">
              Submit
            </Button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Flashcard;
