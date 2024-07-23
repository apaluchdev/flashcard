import React from "react";
import Topic, { ITopic } from "@/models/Topic";
import connect from "@/lib/mongoose-connect";

export default async function Page() {
  connect();

  const topics: ITopic[] | null = await Topic.find();

  if (!topics) throw new Error("Could not fetch topics in server code hmm");

  console.log("Found topics: ", topics);
  return (
    <div className="flex flex-col items-center justify-center">
      {topics &&
        topics.map((topic) => (
          <div key={topic.topicTitle}>{topic.topicTitle}</div>
        ))}
    </div>
  );
}
