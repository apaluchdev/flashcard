import React from "react";
import styles from "./ShuffleLoad.module.css";
// reactstrap components

function ShuffleLoad() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderSquare}></div>
      <div className={styles.loaderSquare}></div>
      <div className={styles.loaderSquare}></div>
      <div className={styles.loaderSquare}></div>
      <div className={styles.loaderSquare}></div>
      <div className={styles.loaderSquare}></div>
      <div className={styles.loaderSquare}></div>
    </div>
  );
}

export default ShuffleLoad;
