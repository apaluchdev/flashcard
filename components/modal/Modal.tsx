"use client";

import styles from "./Modal.module.css";
import { useState, ReactNode } from "react";

interface ParentComponentProps {
  children: ReactNode;
}

const Modal: React.FC<ParentComponentProps> = ({ children }) => {
  const [isVisible, setVisibility] = useState(false);

  function ToggleVisibility() {
    setVisibility(!isVisible);
  }

  return (
    <div>
      <button className={styles.button} onClick={ToggleVisibility}>
        Add Flashcard
      </button>

      {isVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button onClick={ToggleVisibility} className={styles.close}>
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
