import React from "react";
import TopicFinder from "@/components/topic-finder/topic-finder";

export default async function Page() {
  return (
    <div className="flex h-full items-center justify-center">
      <TopicFinder />
    </div>
  );
}
