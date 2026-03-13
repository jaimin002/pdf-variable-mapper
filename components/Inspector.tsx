"use client";

import React from "react";
import styles from "./MainLayout.module.css";

export const Inspector: React.FC = () => {
  return (
    <aside className={styles.inspector}>
      <h2 className={styles.panelTitle}>Preview</h2>
      <div className={styles.panelSection}>
        <p className={styles.muted}>
          PDF preview will appear here when a document is loaded.
        </p>
      </div>
    </aside>
  );
};

export default Inspector;
