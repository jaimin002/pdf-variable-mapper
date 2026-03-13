 "use client";

import React from "react";
import styles from "./MainLayout.module.css";
import { Sidebar } from "./Sidebar";
import { PdfCanvas } from "./PdfCanvas";
import { VariableInspector } from "./VariableInspector";

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.headerTitle}>PDF Variable Mapper</div>
          <div className={styles.headerSubtitle}>
            Map template variables onto your PDFs.
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Sidebar />
        <PdfCanvas />
        <VariableInspector />
      </main>
    </div>
  );
};

export default MainLayout;

