"use client";

import styles from "./ButtonModal.module.css";
import { useState, ReactNode } from "react";

interface ParentComponentProps {
  text: string;
  children: ReactNode;
}

const Modal: React.FC<ParentComponentProps> = ({ text, children }) => {
  const [isVisible, setVisibility] = useState(false);

  function ToggleVisibility() {
    setVisibility(!isVisible);
  }

  return (
    <div>
      {" "}
      <button className={styles.button} onClick={ToggleVisibility}>
        {text}
      </button>
      {isVisible && (
        <div className={styles.modal}>
          <div className={styles.modalWindow}>
            <button onClick={ToggleVisibility} className={styles.close}>
              &#215;
            </button>
            <div className={styles.modalContent}>{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
