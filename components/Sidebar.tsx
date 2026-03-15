"use client";

import React, { ChangeEvent } from "react";
import { useVariableStore, VariableType } from "./variableStore";

const PALETTE_ITEMS: { type: VariableType; label: string; icon: string }[] = [
  { type: "text", label: "Text", icon: "Aa" },
  { type: "number", label: "Number", icon: "123" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "email", label: "Email", icon: "@" },
  { type: "signature", label: "Signature", icon: "✒" },
];

export default function Sidebar() {
  const { setPdfDocument, document } = useVariableStore();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        const data = new Uint8Array(result);
        setPdfDocument({ name: file.name, data });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    type: VariableType
  ) => {
    event.dataTransfer.setData("application/x-variable-type", type);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md shadow-[1px_0_0_0_rgba(15,23,42,0.9)]">
      <div className="flex flex-1 flex-col gap-6 overflow-auto p-5">
        {/* Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Document
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Upload the base PDF file
              </p>
            </div>
          </div>
          <div className="group relative">
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              id="pdf-upload"
              onChange={handleFileChange}
            />
            <div className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] px-6 py-8 transition-all group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-muted)]/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            <div className="text-center">
              <p className="text-xs font-medium text-[var(--text-primary)]">
                Click or drop PDF here
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                Max 50MB • .pdf only
              </p>
            </div>
            </div>
          </div>
          {document.name && (
            <p className="mt-2 truncate rounded-md bg-[var(--accent-muted)]/80 px-2 py-1.5 text-[11px] font-medium text-[var(--accent)]">
              ✓ {document.name}
            </p>
          )}
        </div>

        {/* Variable Palette */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Variable Types
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Drag a type into the canvas
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {PALETTE_ITEMS.map((item) => (
              <button
                key={item.type}
                type="button"
                draggable
                onDragStart={(e) => handleDragStart(e, item.type)}
                className="flex cursor-grab items-center gap-3 rounded-lg border border-[var(--border)]/80 bg-[var(--surface)]/80 px-4 py-3 text-left text-sm text-[var(--text-primary)] shadow-sm shadow-black/40 transition-all hover:-translate-y-[1px] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]/40 active:cursor-grabbing"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--background)] text-xs font-semibold text-[var(--text-secondary)]">
                  {item.icon}
                </span>
                <span className="font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-muted)]">
            Drag a type onto the canvas to add a variable field.
          </p>
        </div>
      </div>
    </aside>
  );
}
