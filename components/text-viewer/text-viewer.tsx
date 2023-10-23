"use client";

import styles from "./text-viewer.module.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); // Switch to quill 2.0 (when available) or Tiptap eventually
import "react-quill/dist/quill.snow.css";

interface Props {
  text: string;
}

const modules = {
  toolbar: false,
};

const TextViewer: React.FC<Props> = ({ text }) => {
  return (
    <div className={styles.text}>
      <ReactQuill
        theme="bubble"
        modules={modules}
        readOnly={true}
        className="h-full cursor-pointer select-none border-none"
        value={text}
      />
    </div>
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
