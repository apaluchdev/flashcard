"use client";

import Topic, { ITopic } from "@/models/Topic";
import React, { useEffect, useState } from "react";
import { columns } from "../flashcard-table/columns";
import { FlashcardTable } from "../flashcard-table/flashcard-table";
import topicClient from "@/clients/topic-client";

function TopicFinder() {
  // const data: ITopic[] = await Topic.find().lean();
  // data.forEach((x) => (x._id = x._id?.toString())); // Simplify complex server side objects

  const [topics, setTopics] = useState<ITopic[]>([]);
  useEffect(() => {
    const GetData = async () => {
      await LoadData();
    };

    GetData();
  }, []);

  async function LoadData() {
    try {
      const foundTopics = await topicClient.GetTopics();
      setTopics(foundTopics);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex w-5/6 items-center justify-center">
      <FlashcardTable columns={columns} data={topics} />
    </div>
  );
}

export default TopicFinder;
