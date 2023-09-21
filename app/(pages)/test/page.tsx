import TextViewer from "@/components/text-viewer/text-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const test = () => {
  return (
    <div>
      <h1>header A</h1>
      <p>paragraph A</p>
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle className="whitespace-normal break-words">
            Card Titleaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaazzzzzzzzzzzzzzzzzzz
          </CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <TextViewer text="<h1>hifffiii</h1>ttetertert" />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default test;
