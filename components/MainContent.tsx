"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Inspector from "@/components/Inspector";

const PdfCanvas = dynamic(() => import("@/components/PdfCanvas"), { ssr: false });

export default function MainContent() {
  return (
    <div className="flex h-screen min-h-screen flex-col bg-transparent">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/60 px-6 backdrop-blur-md shadow-[0_1px_0_0_rgba(15,23,42,0.9)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--accent)] to-emerald-400 text-white shadow-lg shadow-emerald-500/30">
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
                d="M5 5h9l5 5v9H5zM10 9v6m4-4H8"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
              PDF Variable Mapper
            </h1>
            <p className="text-[11px] text-[var(--text-muted)]">
              Design fillable templates on top of static PDFs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-1.5 shadow-sm shadow-black/40 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            <span className="font-medium text-[var(--text-secondary)]">
              Workspace: Default
            </span>
          </div>
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1.5 font-medium text-[var(--text-secondary)] shadow-sm shadow-black/40 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Help
          </button>
        </div>
      </header>

      <main className="flex flex-1 min-h-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Sidebar />
        <PdfCanvas />
        <Inspector />
      </main>
    </div>
  );
}
