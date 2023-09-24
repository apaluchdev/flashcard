import Topic, { ITopic } from "@/models/Topic";
import React from "react";
import { columns } from "../flashcard-table/columns";
import { FlashcardTable } from "../flashcard-table/flashcard-table";

async function TopicFinder() {
  const data: ITopic[] = await Topic.find().lean();
  data.forEach((x) => (x._id = x._id?.toString())); // Simplify complex server side objects
  return (
    <div className="flex w-full justify-center">
      <FlashcardTable columns={columns} data={data} />
    </div>
  );
}

export default TopicFinder;
