"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Inspector from "@/components/Inspector";

const PdfCanvas = dynamic(() => import("@/components/PdfCanvas"), { ssr: false });

export default function MainContent() {
  return (
    <div className="flex h-screen min-h-screen flex-col bg-[var(--background)]">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-[var(--text-primary)]">
              PDF Variable Mapper
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Map template variables to your PDFs
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 min-h-0">
        <Sidebar />
        <PdfCanvas />
        <Inspector />
      </main>
    </div>
  );
}
