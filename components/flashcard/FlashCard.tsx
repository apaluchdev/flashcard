"use client";

import Flashcard from "@/types/Flashcard";
import styles from "./Flashcard.module.css";
import { useState, useEffect } from "react";

interface FlashcardProps {
  userId: string;
  topicId: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ userId, topicId }) => {
  return <div>Hi</div>;
};

export default Flashcard;
