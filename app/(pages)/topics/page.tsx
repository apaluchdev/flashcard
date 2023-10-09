import React from "react";
import TopicFinder from "@/components/topic-finder/topic-finder";
import AddDeck from "@/components/add-deck/add-deck";

export default async function Page() {
  return (
    <div className="flex items-center justify-center">
      <TopicFinder />
    </div>
  );
}
