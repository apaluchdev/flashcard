"use client";

import Topic, { ITopic } from "@/models/Topic";
import React, { useEffect, useState } from "react";
import { columns } from "../flashcard-table/columns";
import { FlashcardTable } from "../flashcard-table/flashcard-table";
import topicClient from "@/clients/topic-client";
import LoadingSpinner from "../loading-spinner/loading-spinner";

function TopicFinder() {
  // const data: ITopic[] = await Topic.find().lean();
  // data.forEach((x) => (x._id = x._id?.toString())); // Simplify complex server side objects

  const [topics, setTopics] = useState<ITopic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const GetData = async () => {
      await LoadData();
      setIsLoading(false);
    };

    GetData();
  }, []);

  async function LoadData() {
    try {
      const foundTopics = await topicClient.GetTopics();
      console.log("Got topics!");
      setTopics(foundTopics);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex h-full w-5/6 items-center justify-center">
      {isLoading && <LoadingSpinner />}
      {!isLoading && <FlashcardTable columns={columns} data={topics} />}
    </div>
  );
}

export default TopicFinder;
