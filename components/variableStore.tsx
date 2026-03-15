"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type VariableType = "text" | "number" | "date" | "email" | "signature";

export interface VariablePlacement {
  id: string;
  key: string;
  label?: string;
  type: VariableType;
  page: number; // 1-based page index
  x: number; // normalized [0,1] from left
  y: number; // normalized [0,1] from top
  width: number; // normalized [0,1] of page width
  height: number; // normalized [0,1] of page height
}

export interface TemplateExport {
  documentName?: string;
  coordinateSystem: {
    origin: "top-left";
    units: "normalized";
    description: string;
  };
  variables: VariablePlacement[];
}

interface DocumentState {
  name?: string;
  fileData: Uint8Array | null;
  numPages: number;
  currentPage: number;
}

interface VariableStoreState {
  document: DocumentState;
  variables: VariablePlacement[];
  selectedVariableId?: string;
}

interface HistoryState {
  past: VariableStoreState[];
  present: VariableStoreState;
  future: VariableStoreState[];
}

interface VariableStoreContext extends VariableStoreState {
  setPdfDocument: (opts: { name?: string; data: Uint8Array }) => void;
  setNumPages: (numPages: number) => void;
  setCurrentPage: (page: number) => void;
  addVariableAt: (opts: {
    page: number;
    x: number;
    y: number;
    type: VariableType;
  }) => void;
  updateVariable: (
    id: string,
    updates: Partial<Pick<VariablePlacement, "key" | "label" | "type" | "x" | "y" | "width" | "height">>
  ) => void;
  deleteVariable: (id: string) => void;
  selectVariable: (id: string | undefined) => void;
  exportTemplate: () => TemplateExport;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const VariableStoreContext = createContext<VariableStoreContext | undefined>(
  undefined
);

export function VariableStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: {
      document: {
        name: undefined,
        fileData: null,
        numPages: 0,
        currentPage: 1,
      },
      variables: [],
      selectedVariableId: undefined,
    },
    future: [],
  });

  const state = history.present;

  const pushState = useCallback((next: VariableStoreState) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: next,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const past = prev.past.slice(0, -1);
      return {
        past,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const [next, ...rest] = prev.future;
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: rest,
      };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const setPdfDocument: VariableStoreContext["setPdfDocument"] = useCallback(
    ({ name, data }) => {
      pushState({
        document: {
          name,
          fileData: data,
          numPages: 0,
          currentPage: 1,
        },
        variables: [],
        selectedVariableId: undefined,
      });
    },
    [pushState]
  );

  const setNumPages: VariableStoreContext["setNumPages"] = useCallback(
    (numPages) => {
      pushState({
        ...state,
        document: {
          ...state.document,
          numPages,
          currentPage: Math.min(
            Math.max(state.document.currentPage, 1),
            Math.max(numPages, 1)
          ),
        },
      });
    },
    [pushState, state]
  );

  const setCurrentPage: VariableStoreContext["setCurrentPage"] = useCallback(
    (page) => {
      pushState({
        ...state,
        document: {
          ...state.document,
          currentPage: Math.min(
            Math.max(page, 1),
            Math.max(state.document.numPages, 1)
          ),
        },
      });
    },
    [pushState, state]
  );

  const addVariableAt: VariableStoreContext["addVariableAt"] = useCallback(
    ({ page, x, y, type }) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `var_${Math.random().toString(36).slice(2)}`;
      const width = 0.18;
      const height = 0.05;

      pushState({
        ...state,
        variables: [
          ...state.variables,
          {
            id,
            key: `var_${state.variables.length + 1}`,
            label: "",
            type,
            page,
            x,
            y,
            width,
            height,
          },
        ],
        selectedVariableId: id,
      });
    },
    [pushState, state]
  );

  const updateVariable: VariableStoreContext["updateVariable"] = useCallback(
    (id, updates) => {
      const nextVariables = state.variables.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      );

      // Enforce unique keys per document when key is updated
      if (updates.key !== undefined) {
        const trimmed = updates.key.trim();
        if (trimmed.length === 0) {
          // allow empty; can be validated at export time if desired
        } else {
          const keyCounts = nextVariables.reduce<Record<string, number>>(
            (acc, v) => {
              const k = v.key.trim();
              if (!k) return acc;
              acc[k] = (acc[k] || 0) + 1;
              return acc;
            },
            {}
          );
          const hasDuplicate = Object.values(keyCounts).some((c) => c > 1);
          if (hasDuplicate) {
            // Do not apply state change if it would introduce duplicates
            return;
          }
        }
      }

      pushState({
        ...state,
        variables: nextVariables,
      });
    },
    [pushState, state]
  );

  const deleteVariable: VariableStoreContext["deleteVariable"] = useCallback(
    (id) => {
      const remaining = state.variables.filter((v) => v.id !== id);
      const selectedVariableId =
        state.selectedVariableId === id ? undefined : state.selectedVariableId;
      pushState({
        ...state,
        variables: remaining,
        selectedVariableId,
      });
    },
    [pushState, state]
  );

  const selectVariable: VariableStoreContext["selectVariable"] = useCallback(
    (id) => {
      // Selection changes are not recorded in history; they don't affect export
      setHistory((prev) => ({
        ...prev,
        present: {
          ...prev.present,
          selectedVariableId: id,
        },
      }));
    },
    []
  );

  const exportTemplate: VariableStoreContext["exportTemplate"] =
    useCallback(() => {
      return {
        documentName: state.document.name,
        coordinateSystem: {
          origin: "top-left",
          units: "normalized",
          description:
            "x and y are normalized coordinates within each page where 0 is left/top and 1 is right/bottom; width and height are normalized sizes relative to page width/height.",
        },
        variables: state.variables,
      };
    }, [state.document.name, state.variables]);

  const value: VariableStoreContext = useMemo(
    () => ({
      ...state,
      setPdfDocument,
      setNumPages,
      setCurrentPage,
      addVariableAt,
      updateVariable,
      deleteVariable,
      selectVariable,
      exportTemplate,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [
      state,
      setPdfDocument,
      setNumPages,
      setCurrentPage,
      addVariableAt,
      updateVariable,
      deleteVariable,
      selectVariable,
      exportTemplate,
      undo,
      redo,
      canUndo,
      canRedo,
    ]
  );

  return (
    <VariableStoreContext.Provider value={value}>
      {children}
    </VariableStoreContext.Provider>
  );
}

export function useVariableStore(): VariableStoreContext {
  const ctx = useContext(VariableStoreContext);
  if (!ctx) {
    throw new Error("useVariableStore must be used within VariableStoreProvider");
  }
  return ctx;
}

