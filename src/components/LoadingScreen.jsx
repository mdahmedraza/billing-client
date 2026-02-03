import React from "react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>
    </div>
  );
}
