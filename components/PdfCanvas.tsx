 "use client";

import React from "react";
import styles from "./MainLayout.module.css";

export const PdfCanvas: React.FC = () => {
  return (
    <section className={styles.canvas} aria-label="PDF canvas placeholder">
      <div className={styles.canvasInner}>
        <h2 className={styles.panelTitle}>PDF Canvas</h2>
        <p className={styles.muted}>
          The uploaded PDF will be rendered here. You&apos;ll be able to pan,
          zoom, and place variable markers on top of each page.
        </p>
      </div>
    </section>
  );
};

export default PdfCanvas;

