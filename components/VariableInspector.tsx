"use client";

import React from "react";

export default function VariableInspector() {
  return (
    <section style={{
      width: "300px",
      backgroundColor: "#fff",
      borderLeft: "1px solid #e5e7eb",
      padding: "20px"
    }}>
      <h2 style={{ fontSize: "18px", marginBottom: "15px" }}>Variables</h2>
      <p style={{ color: "#999", fontSize: "14px" }}>
        No variables selected.
      </p>
    </section>
  );
}
