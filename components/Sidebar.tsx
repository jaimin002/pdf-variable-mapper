"use client";

import React from "react";
import styles from "./MainLayout.module.css";

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div>
        <h2 className={styles.panelTitle}>PDF</h2>
        <div className={styles.panelSection}>
          <button type="button" className={styles.button}>
            Upload PDF…
          </button>
        </div>
      </div>

      <div>
        <h2 className={styles.panelTitle}>Page</h2>
        <div className={styles.panelSection}>
          <select className={styles.pageSelector} defaultValue="1">
            <option value="1">Page 1</option>
            <option value="2">Page 2</option>
            <option value="3">Page 3</option>
          </select>
        </div>
      </div>

      <div>
        <h2 className={styles.panelTitle}>Variables</h2>
        <div className={styles.panelSection}>
          <ul className={styles.variableList}>
            <li className={styles.variableListItem}>
              <span className={styles.variableName}>{"{first_name}"}</span>
              <span className={styles.variableType}>Text</span>
            </li>
            <li className={styles.variableListItem}>
              <span className={styles.variableName}>{"{last_name}"}</span>
              <span className={styles.variableType}>Text</span>
            </li>
            <li className={styles.variableListItem}>
              <span className={styles.variableName}>{"{due_date}"}</span>
              <span className={styles.variableType}>Date</span>
            </li>
          </ul>
          <p className={styles.muted}>
            This is a static preview list. Variable detection will be wired up
            later.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;







