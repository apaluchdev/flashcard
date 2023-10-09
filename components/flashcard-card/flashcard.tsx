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
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  PlusSquare,
  Save,
  Shuffle,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  flashcardData: IFlashcard[];
  userId: string;
  topic: string;
}

const Flashcard: React.FC<Props> = ({ userId, topic, flashcardData }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [card, setCard] = useState<IFlashcard>({ question: "", answer: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [isCardNavigation, setIsCardNavigation] = useState<boolean>(false);
  const cards = useRef<IFlashcard[]>([]);
  const cardIndex = useRef<number>(0);
  const originalCard = useRef<IFlashcard>({ question: "", answer: "" }); // Used to revert edits
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const userOwnsDeck =
    Boolean(session?.user) && session?.user.username == userId;

  console.log("Does user own deck? " + userOwnsDeck);
  useEffect(() => {
    cardIndex.current = parseInt(searchParams.get("cardIndex") || "0");
    cards.current = flashcardData;
    setCard(cards.current[cardIndex.current]);
    setLoading(false);
  }, []);

  useEffect(() => {
    router.push(`?cardIndex=${cardIndex.current}`, {
      scroll: false,
    });
  }, [cardIndex.current, router]);

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

    // cardIndex.current = index;
    setCard(cards.current[index]);
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

    try {
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
        throw new Error("Error occurred saving flashcard");
      }
    } catch {
      toast({
        variant: "destructive",
        description: "An error occurred.",
      });
    }
  }

  function onCancelEdit() {
    setIsEdit(false);

    setCard(originalCard.current);

    // Cancelled adding a new card, remove it
    if (!card.topicId) setCard(cards.current[cards.current.length - 1]);
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
        className="w-15"
        disabled={!userOwnsDeck || isEdit}
        onClick={DeleteCard}
        variant="destructive"
      >
        <Trash2 />
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

  async function NextCard() {
    cardIndex.current = Math.min(
      cardIndex.current + 1,
      cards.current.length - 1,
    );
    setIsCardNavigation(!isCardNavigation);
    //setCard(cards.current[cardIndex.current]);
  }

  async function PreviousCard() {
    cardIndex.current = Math.max(0, cardIndex.current - 1);
    setIsCardNavigation(!isCardNavigation);
    //setCard(cards.current[cardIndex.current]);
  }

  function UpdateCard() {
    setCard(cards.current[cardIndex.current]);
    setIsCardNavigation(!isCardNavigation);
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
      className={`${roboto.className} min-w-content mb-36 flex h-full w-4/5 max-w-3xl flex-col items-center justify-center gap-6`}
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full justify-start gap-3">
          <AddDeck />
        </div>
        <div className="flex w-full justify-end gap-3">
          <Button disabled={isEdit} onClick={ShuffleCards} className="w-15">
            <Shuffle />
          </Button>
          <Button
            disabled={!userOwnsDeck || isEdit}
            onClick={EditCard}
            className="w-15"
          >
            <Edit />
          </Button>
        </div>
      </div>

      {/* Card  */}
      <FlipCard
        flashcard={{
          question: card.question,
          answer: card.answer,
          topic: topic || "",
        }}
        isEditMode={isEdit}
        onFlipCompleted={UpdateCard}
      />

      {/* Bottom Buttons  */}
      <div className="flex w-full justify-between gap-1">
        <PreviousAndNextButtons />
        <AddAndDeleteButtons />
      </div>

      {/* Bottom Edit Mode Area */}
      {isEdit && (
        <div className="flex w-full flex-col justify-between gap-5">
          <Input
            autoFocus
            type="text"
            placeholder="Question"
            value={card.question}
            onChange={(event) =>
              setCard({ ...card, question: event.target.value })
            }
          />
          <TextEditor
            TextEditorCallback={(answer: string) =>
              setCard({ ...card, answer: answer })
            }
            initialText={card.answer}
          />
        </div>
      )}
    </div>
  );

  function PreviousAndNextButtons() {
    return (
      <div className="flex w-full gap-3">
        <Button
          disabled={isEdit}
          onClick={PreviousCard}
          className="w-10"
          variant="outline"
        >
          <ChevronLeft className="absolute" />
        </Button>
        <Button
          disabled={isEdit}
          onClick={NextCard}
          className="w-10"
          variant="outline"
        >
          <ChevronRight className="absolute" />
        </Button>
        <p className="mt-2.5 text-sm">
          {cardIndex.current + 1} / {cards.current.length}
        </p>
      </div>
    );
  }

  function AddAndDeleteButtons() {
    return (
      <div className="flex w-full justify-end gap-3">
        {isEdit ? (
          <DiscardDialog onDiscard={onCancelEdit} onCancel={() => null} />
        ) : (
          <DeleteButton />
        )}
        {isEdit ? (
          <Button
            disabled={!userOwnsDeck} // Api also denies if user not signed in
            onClick={onSaveCard}
            className="w-15"
          >
            <Save />
          </Button>
        ) : (
          <Button
            disabled={!userOwnsDeck || isEdit}
            onClick={AddCard}
            className="w-15"
          >
            <PlusSquare />
          </Button>
        )}
      </div>
    );
  }
};

export default Flashcard;
