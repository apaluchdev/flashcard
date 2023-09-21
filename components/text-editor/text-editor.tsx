"use client";
import { useEffect, useState } from "react";
import styles from "./text-editor.module.css";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { formats, modules } from "./editor-toolbar";

interface Props {
  TextEditorCallback: Function;
  initialText: string;
}

const TextEditor: React.FC<Props> = ({ TextEditorCallback, initialText }) => {
  const [value, setValue] = useState(initialText);

  useEffect(() => {
    TextEditorCallback(value);
  }, [value]);

  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values

    ["clean"], // remove formatting button
  ];

  // const modules = {
  //   toolbar: {
  //     toolbarOptions,
  //   },
  // };

  return (
    <div className={styles.text}>
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder={"Enter answer..."}
        modules={modules}
        formats={formats}
      />
    </div>

    // <ReactQuill
    //   theme="snow"
    //   className="h-full text-4xl"
    //   value={value}
    //   onChange={setValue}
    // />
  );
};

export default TextEditor;
