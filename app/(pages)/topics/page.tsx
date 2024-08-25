import React from "react";
import { TopicRepository } from "@/repositories/TopicRepository";
import { TopicTable } from "@/components/topic-table/topic-table";
import { topicTableColumns } from "@/components/topic-table/topicTableColumns";

export const fetchCache = "force-no-store";

export default async function Page() {
  const topicRepository = new TopicRepository();
  const topics = await topicRepository.getAll();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <h1 className="text-6xl tracking-tighter text-gray-700 fade-in md:text-6xl">
        Topics
      </h1>
      <div className="flex w-5/6 items-center justify-center">
        <TopicTable
          columns={topicTableColumns}
          data={JSON.parse(JSON.stringify(topics))}
        />
      </div>
    </div>
  );
}
