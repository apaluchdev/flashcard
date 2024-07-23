import React from "react";
import Topic, { ITopic } from "@/models/Topic";
import connect from "@/lib/mongoose-connect";

export default async function Page() {
  connect();

  const topics: ITopic[] | null = await Topic.find();

  if (!topics) throw new Error("Could not fetch topics in server code hmm");

  const myTopic = await Topic.findOne({ topicTitle: "CompTIA Security  1.5" });

  console.log("Found topics: ", topics);
  return (
    <div className="flex flex-col items-center justify-center">
      {topics &&
        topics.map((topic) => (
          <div key={topic.topicTitle}>{topic.topicTitle}</div>
        ))}
      <h1>Special request: {myTopic?.topicTitle}</h1>
    </div>
  );
}
