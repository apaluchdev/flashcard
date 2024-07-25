import React from "react";
import { columns } from "../flashcard-table/columns";
import { FlashcardTable } from "../flashcard-table/flashcard-table";
import { TopicRepository } from "@/repositories/TopicRepository";

async function TopicFinder() {
  const topicRepository = new TopicRepository();
  const topics = await topicRepository.getAll();

  return (
    <div className="flex h-full w-5/6 items-center justify-center">
      <FlashcardTable
        columns={columns}
        data={JSON.parse(JSON.stringify(topics))}
      />
    </div>
  );
}

export default TopicFinder;
