"use client";

import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f3f4f6"
    }}>
      {children}
    </div>
  );
}
