"use client";

// https://stackoverflow.com/a/73143908

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
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ClipboardCopy,
  Edit,
  PlusSquare,
  Save,
  Shuffle,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import userClient from "@/clients/user-client";
import { Console } from "console";

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
  const searchParams = useSearchParams();
  const cardIndex = parseInt(searchParams.get("cardIndex") || "0");
  const { data: session } = useSession();
  const router = useRouter();

  // State
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<String[]>([]);
  const [cards, setCards] = useState<IFlashcard[]>(flashcardData);
  const [editCard, setEditCard] = useState<IFlashcard>({
    ...flashcardData[cardIndex],
  });
  const userOwnsDeck =
    Boolean(session?.user) && session?.user.username == userId;

  if (cards.length > 0 && cardIndex < cards.length)
    cards[cardIndex].topic = topic;

  useEffect(() => {
    LoadBookmarks();
    setLoading(false);
  }, []);

  function EditCard() {
    setIsEdit(true);
    setEditCard(cards[cardIndex]);

    router.push(`?cardIndex=${cardIndex}&flipped=true`, {
      scroll: false,
    });
  }

  async function onSaveCard() {
    const isNewCard = editCard._id == undefined;
    if (isNewCard) {
      var topicId = (
        await topicClient.GetTopicByUserIdAndTopicTitle(userId, topic)
      )?._id;
    } else {
      cards.pop();
      cards.push({ ...editCard });
      setCards(cards);
    }

    try {
      const result = await flashcardClient.UpsertFlashcard({
        ...editCard,
        topicId: topicId,
      });
      if (result) {
        if (isNewCard) {
          LoadCards(cards.length);
        }
        setIsEdit(false);
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

  function copyToClipboard() {
    var copyTextHTML = `${cards[cardIndex].answer}`;
    var copyText = cards[cardIndex].question + " ";
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
    if (!editCard._id)
      router.push(`?cardIndex=${cards.length - 1}`, {
        scroll: false,
      });

    setIsEdit(false);
    setEditCard({ ...flashcardData[cardIndex] });
  }

  function DeleteButton() {
    async function DeleteCard() {
      var isDeleted = await flashcardClient.DeleteFlashcardById(
        cards[cardIndex]._id || "",
      );
      if (isDeleted) {
        toast({
          variant: "success",
          description: "Flashcard deleted.",
        });
        LoadCards(Math.max(0, cardIndex - 1));
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

  async function LoadCards(index: number = 0) {
    let data: IFlashcard[] =
      await flashcardClient.GetFlashcardsByUserIdAndTopicTitleAsync(
        userId,
        topic,
      );

    setCards(data.sort((a, b) => ((a.order || 0) > (b.order || 0) ? 1 : -1)));
    router.push(`?cardIndex=${index}`, {
      scroll: false,
    });
    setLoading(false);
  }

  async function LoadBookmarks() {
    if (!session?.user?.username) return;

    let bookmarks: String[] = await userClient.GetBookmarks(
      session?.user.username,
    );

    setBookmarks(bookmarks);
  }

  async function AddCard() {
    setEditCard({
      question: "",
      answer: "",
      topicId: cards[cardIndex]?.topicId,
      userId: userId,
    });

    router.push(`?cardIndex=${cardIndex + 1}&flipped=true`, {
      scroll: false,
    });
    setIsEdit(true);
  }

  function shuffleCards() {
    if (!cards || cards.length < 2) return;
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
    shuffledCards;
    setCards(shuffledCards);
    router.push(`?cardIndex=${0}`, {
      scroll: false,
    });
  }

  async function BookmarkCard() {
    let username = session?.user.username;

    if (!username) return;

    await userClient.UpsertUser({
      username: username,
      email: "",
      bookmarkedCards: [cards[cardIndex]._id ?? ""],
    });

    LoadBookmarks();
  }

  async function NextCard() {
    router.push(`?cardIndex=${Math.min(cardIndex + 1, cards.length - 1)}`, {
      scroll: false,
    });
  }

  async function PreviousCard() {
    router.push(`?cardIndex=${Math.max(0, cardIndex - 1)}`, {
      scroll: false,
    });
  }

  if (loading)
    return (
      <div className="flex h-full w-4/6 max-w-3xl flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!isEdit && (!cards || cards.length < 1)) {
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
          <Button
            onClick={BookmarkCard}
            className={`w-15 ${
              bookmarks.includes(cards[cardIndex]?._id ?? "") && "bg-yellow-400"
            }`}
          >
            <Bookmark />
          </Button>
          <Button disabled={isEdit} onClick={shuffleCards} className="w-15">
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

      {/* Card */}
      <FlipCard
        flashcard={isEdit ? editCard : cards[cardIndex]}
        isEditMode={isEdit}
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
            value={editCard.question}
            onChange={(event) => {
              setEditCard({ ...editCard, question: event.target.value });
            }}
          />
          <TextEditor
            TextEditorCallback={(answer: string) =>
              setEditCard({ ...editCard, answer: answer })
            }
            initialText={editCard.answer}
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
          {cardIndex + 1} / {cards.length}
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
        <Button onClick={copyToClipboard} className="w-15">
          <ClipboardCopy />
        </Button>
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
