"use client";
import { useEffect, useState } from "react";
import styles from "./text-editor.module.css";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Props {
  TextEditorCallback: Function;
  initialText: string;
}

const TextEditor: React.FC<Props> = ({ TextEditorCallback, initialText }) => {
  const [value, setValue] = useState(initialText);

  useEffect(() => {
    TextEditorCallback(value);
  }, [value]);

  let modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className={styles.text}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder={"Enter answer..."}
        modules={modules}
      />
    </div>
  );
};

export default TextEditor;
