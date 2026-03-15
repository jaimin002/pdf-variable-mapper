"use client";

import React, { useMemo, useState } from "react";
import { useVariableStore, VariableType } from "./variableStore";

const VARIABLE_TYPE_OPTIONS: { value: VariableType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "email", label: "Email" },
  { value: "signature", label: "Signature" },
];

export default function Inspector() {
  const {
    variables,
    selectedVariableId,
    updateVariable,
    deleteVariable,
    exportTemplate,
  } = useVariableStore();

  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => variables.find((v) => v.id === selectedVariableId),
    [variables, selectedVariableId]
  );

  const handleExport = () => {
    setError(null);
    const template = exportTemplate();

    // Runtime validation: ensure unique keys (non-empty) and basic shape
    const keyCounts = template.variables.reduce<Record<string, number>>(
      (acc, v) => {
        const k = v.key.trim();
        if (!k) return acc;
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      },
      {}
    );
    const duplicateKeys = Object.entries(keyCounts)
      .filter(([, count]) => count > 1)
      .map(([key]) => key);

    if (duplicateKeys.length > 0) {
      setError(
        `Export blocked: duplicate keys detected (${duplicateKeys.join(
          ", "
        )}). Keys must be unique per document.`
      );
      return;
    }

    if (!Array.isArray(template.variables) || template.variables.length === 0) {
      setError("Export blocked: no variables defined in the template.");
      return;
    }

    if (
      !template.coordinateSystem ||
      template.coordinateSystem.origin !== "top-left" ||
      template.coordinateSystem.units !== "normalized"
    ) {
      setError("Export blocked: coordinate system metadata is invalid.");
      return;
    }

    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.documentName ?? "template"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex w-80 shrink-0 flex-col border-l border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md shadow-[-1px_0_0_0_rgba(15,23,42,0.9)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/80 px-5 py-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Inspector
          </h2>
          <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
            {selected
              ? "Edit variable properties"
              : "Select a variable on the canvas"}
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-md shadow-emerald-500/30 transition-colors hover:bg-[var(--accent-hover)]"
          onClick={handleExport}
        >
          Export JSON
        </button>
      </div>

      <div className="flex-1 overflow-auto p-5">
        {!selected ? (
          <div className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--background)]/70 p-6 text-center text-[13px]">
            <p className="text-[var(--text-muted)]">
              No variable selected. Drag a type onto the canvas and click it to
              edit here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/80 p-4 shadow-sm shadow-black/40">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_0_4px_rgba(34,197,94,0.25)]" />
                <span className="flex-1 truncate font-semibold text-[var(--text-primary)]">
                  {selected.key || "Unnamed"}
                </span>
                <span className="rounded-full bg-[var(--accent-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  {selected.type}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[var(--text-secondary)]">
                    Key
                  </label>
                  <input
                    type="text"
                    value={selected.key}
                    onChange={(e) =>
                      updateVariable(selected.id, { key: e.target.value })
                    }
                    placeholder="e.g. customerName"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                  />
                  {error && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {error}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[var(--text-secondary)]">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    value={selected.label ?? ""}
                    onChange={(e) =>
                      updateVariable(selected.id, { label: e.target.value })
                    }
                    placeholder="Display label"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-[var(--text-secondary)]">
                    Type
                  </label>
                  <select
                    value={selected.type}
                    onChange={(e) =>
                      updateVariable(selected.id, {
                        type: e.target.value as VariableType,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
                  >
                    {VARIABLE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 rounded-lg bg-[var(--surface)]/80 px-3 py-2 text-[11px] text-[var(--text-muted)]">
                  <span>Page {selected.page}</span>
                  <span>•</span>
                  <span>
                    x={selected.x.toFixed(2)}, y={selected.y.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition-colors hover:bg-[var(--accent-hover)]"
                onClick={handleExport}
              >
                Export JSON
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-[var(--border)] py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/40"
                onClick={() => deleteVariable(selected.id)}
              >
                Delete Variable
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
