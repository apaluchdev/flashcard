"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Props {
  text: string;
}

const TextViewer: React.FC<Props> = ({ text }) => {
  return (
    <ReactQuill
      className="h-full"
      theme={"bubble"}
      value={text}
      readOnly={true}
    />
  );
};

export default TextViewer;

// const TextEditor: React.FC<Props> = ({ TextEditorCallback }) => {
//   const [value, setValue] = useState("");

//   function handleChange(value: string) {
//     setValue(value);
//     TextEditorCallback(value);
//   }

//   return <ReactQuill value={value} onChange={() => handleChange(value)} />;
// };

// export default TextEditor;
