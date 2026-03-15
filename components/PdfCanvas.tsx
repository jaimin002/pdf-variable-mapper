"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useVariableStore } from "./variableStore";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs";

export default function PdfCanvas() {
  const {
    document,
    variables,
    selectedVariableId,
    setNumPages,
    setCurrentPage,
    addVariableAt,
    selectVariable,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useVariableStore();

  const currentPageVariables = variables.filter(
    (v) => v.page === document.currentPage
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type =
      (event.dataTransfer.getData("application/x-variable-type") as
        | "text"
        | "number"
        | "date"
        | "email"
        | "signature") || "text";
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const clampedX = Math.min(Math.max(x, 0), 1);
    const clampedY = Math.min(Math.max(y, 0), 1);
    addVariableAt({
      page: document.currentPage,
      x: clampedX,
      y: clampedY,
      type,
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handlePageChange = (delta: number) => {
    setCurrentPage(document.currentPage + delta);
  };

  const [zoom, setZoom] = useState(1);

  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.5), 2);
      return Number(next.toFixed(2));
    });
  };

  const hasPdf = !!document.fileData;

  const file = useMemo(() => {
    if (!document.fileData) return undefined;
    const copy = new Uint8Array(document.fileData);
    const blob = new Blob([copy], { type: "application/pdf" });
    return { url: URL.createObjectURL(blob) };
  }, [document.fileData]);

  useEffect(() => {
    if (file?.url) return () => URL.revokeObjectURL(file.url);
  }, [file?.url]);

  return (
    <section className="flex flex-1 flex-col min-w-0 overflow-hidden p-6">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3 shadow-md shadow-black/40">
        <div className="flex items-center gap-2">
          <div className="h-6 w-0.5 rounded-full bg-[var(--accent-muted)]" />
          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              {!hasPdf
                ? "Upload a PDF to start mapping variables."
                : "Drag variable types onto the page to place fields."}
            </p>
            {hasPdf && (
              <p className="text-[11px] text-[var(--text-muted)]">
                Click a field to edit properties in the inspector.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {document.numPages > 0 && (
            <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-1 py-1 text-xs shadow-sm shadow-black/40">
              <button
                type="button"
                className="rounded-full px-2.5 py-1 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background)] hover:text-[var(--text-primary)] disabled:opacity-40"
                onClick={() => handlePageChange(-1)}
                disabled={document.currentPage <= 1}
              >
                ←
              </button>
              <span className="px-2 text-[11px] text-[var(--text-muted)]">
                Page {document.currentPage} of {document.numPages}
              </span>
              <button
                type="button"
                className="rounded-full px-2.5 py-1 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background)] hover:text-[var(--text-primary)] disabled:opacity-40"
                onClick={() => handlePageChange(1)}
                disabled={document.currentPage >= document.numPages}
              >
                →
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-2 py-1 text-xs shadow-sm shadow-black/40">
            <button
              type="button"
              className="rounded-full px-2.5 py-1 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background)] hover:text-[var(--text-primary)] disabled:opacity-40"
              onClick={undo}
              disabled={!canUndo}
            >
              Undo
            </button>
            <button
              type="button"
              className="rounded-full px-2.5 py-1 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background)] hover:text-[var(--text-primary)] disabled:opacity-40"
              onClick={redo}
              disabled={!canRedo}
            >
              Redo
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-2 py-1 text-xs shadow-sm shadow-black/40">
            <button
              type="button"
              className="rounded-full px-2.5 py-1 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background)] hover:text-[var(--text-primary)]"
              onClick={() => handleZoom(-0.1)}
            >
              −
            </button>
            <span className="px-1 text-[11px] text-[var(--text-muted)]">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              type="button"
              className="rounded-full px-2.5 py-1 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background)] hover:text-[var(--text-primary)]"
              onClick={() => handleZoom(0.1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex flex-1 min-h-[420px] items-center justify-center overflow-auto rounded-2xl border border-[var(--border)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl shadow-black/60">
        {!hasPdf ? (
          <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--accent-muted)] text-[var(--accent)]">
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                PDF Preview
              </h3>
              <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
                Upload a PDF from the sidebar, then drag variable types onto the
                page to define your template.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="relative inline-block rounded-xl bg-[var(--background)]/60 p-6 shadow-xl shadow-black/60"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex items-center justify-center px-12 py-16 text-sm text-[var(--text-muted)]">
                  Loading PDF…
                </div>
              }
            >
              <div className="flex items-center justify-center">
                <Page
                  pageNumber={document.currentPage}
                  width={640 * zoom}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </Document>

            <div
              className="pointer-events-none absolute inset-6"
              onClick={() => selectVariable(undefined)}
            >
              {currentPageVariables.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`pointer-events-auto absolute flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] shadow-sm transition-all ${
                    v.id === selectedVariableId
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent)]"
                  }`}
                  style={{
                    left: `${v.x * 100}%`,
                    top: `${v.y * 100}%`,
                    width: `${Math.max(v.width * 100, 12)}%`,
                    minWidth: 60,
                    height: `${Math.max(v.height * 100, 4)}%`,
                    minHeight: 24,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectVariable(v.id);
                  }}
                >
                  <span className="truncate font-medium">
                    {v.key || "(unnamed)"}
                  </span>
                  <span className="shrink-0 rounded px-1 py-0.5 text-[9px] font-medium uppercase opacity-80">
                    {v.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
