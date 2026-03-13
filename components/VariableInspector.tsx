 "use client";

import React from "react";
import styles from "./MainLayout.module.css";

export const VariableInspector: React.FC = () => {
  return (
    <aside className={styles.inspector}>
      <div>
        <h2 className={styles.panelTitle}>Variable inspector</h2>
        <p className={styles.muted}>
          Select a variable from the list or canvas to edit its settings.
        </p>
      </div>

      <div className={styles.panelSection}>
        <div className={styles.inspectorField}>
          <label className={styles.label} htmlFor="variable-name">
            Name
          </label>
          <input
            id="variable-name"
            className={styles.input}
            placeholder="e.g. first_name"
            disabled
          />
        </div>

        <div className={styles.inspectorField}>
          <label className={styles.label} htmlFor="variable-label">
            Label
          </label>
          <input
            id="variable-label"
            className={styles.input}
            placeholder="Visible label for this field"
            disabled
          />
        </div>

        <div className={styles.inspectorField}>
          <label className={styles.label} htmlFor="variable-description">
            Description
          </label>
          <textarea
            id="variable-description"
            className={styles.textarea}
            placeholder="Optional helper text for this variable"
            disabled
          />
        </div>

        <p className={styles.muted}>
          All fields are read-only for now. Editing and validation logic will be
          added later.
        </p>
      </div>
    </aside>
  );
};

export default VariableInspector;

