"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Props {
  TextEditorCallback: Function;
}

const TextEditor: React.FC<Props> = ({ TextEditorCallback }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    TextEditorCallback(value);
  }, [value]);

  return <ReactQuill className="h-full" value={value} onChange={setValue} />;
};

export default TextEditor;

// const TextEditor: React.FC<Props> = ({ TextEditorCallback }) => {
//   const [value, setValue] = useState("");

//   function handleChange(value: string) {
//     setValue(value);
//     TextEditorCallback(value);
//   }

//   return <ReactQuill value={value} onChange={() => handleChange(value)} />;
// };

// export default TextEditor;
