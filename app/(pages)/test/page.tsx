import React from "react";
import Topic, { ITopic } from "@/models/Topic";
import connect from "@/lib/mongoose-connect";

export default async function Page() {
  connect();

  const topics: ITopic[] | null = await Topic.find();

  if (!topics) throw new Error("Could not fetch topics in server code hmm");

  const myTopic = await Topic.findOne({ topicTitle: "CompTIA Security 1.5" });
  const myTopic2 = await Topic.findOne({ _id: "65076dfb6eaaed8c73b17500" });
  const myTopic3 = await Topic.findOne({ topicTitle: "InfoSec" });
  //const myTopic4 = await Topic.findOne({ topicTitle: "CompTIA Security 1.5" });

  console.log("Found topics: ", topics);
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>1: {myTopic?.topicTitle}</h1>
      <h1>2: {myTopic2?.topicTitle}</h1>
      <h1>3: {myTopic3?.topicTitle}</h1>

      {topics &&
        topics.map((topic) => (
          <div key={topic.topicTitle}>{topic.topicTitle}</div>
        ))}
    </div>
  );
}
