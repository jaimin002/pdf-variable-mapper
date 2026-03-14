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
}

const VariableStoreContext = createContext<VariableStoreContext | undefined>(
  undefined
);

export function VariableStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<VariableStoreState>({
    document: {
      name: undefined,
      fileData: null,
      numPages: 0,
      currentPage: 1,
    },
    variables: [],
    selectedVariableId: undefined,
  });

  const setPdfDocument: VariableStoreContext["setPdfDocument"] = useCallback(
    ({ name, data }) => {
      setState((prev) => ({
        document: {
          name,
          fileData: data,
          numPages: 0,
          currentPage: 1,
        },
        variables: [],
        selectedVariableId: undefined,
      }));
    },
    []
  );

  const setNumPages: VariableStoreContext["setNumPages"] = useCallback(
    (numPages) => {
      setState((prev) => ({
        ...prev,
        document: {
          ...prev.document,
          numPages,
          currentPage: Math.min(
            Math.max(prev.document.currentPage, 1),
            Math.max(numPages, 1)
          ),
        },
      }));
    },
    []
  );

  const setCurrentPage: VariableStoreContext["setCurrentPage"] = useCallback(
    (page) => {
      setState((prev) => ({
        ...prev,
        document: {
          ...prev.document,
          currentPage: Math.min(
            Math.max(page, 1),
            Math.max(prev.document.numPages, 1)
          ),
        },
      }));
    },
    []
  );

  const addVariableAt: VariableStoreContext["addVariableAt"] = useCallback(
    ({ page, x, y, type }) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `var_${Math.random().toString(36).slice(2)}`;
      const width = 0.18;
      const height = 0.05;

      setState((prev) => ({
        ...prev,
        variables: [
          ...prev.variables,
          {
            id,
            key: `var_${prev.variables.length + 1}`,
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
      }));
    },
    []
  );

  const updateVariable: VariableStoreContext["updateVariable"] = useCallback(
    (id, updates) => {
      setState((prev) => ({
        ...prev,
        variables: prev.variables.map((v) =>
          v.id === id ? { ...v, ...updates } : v
        ),
      }));
    },
    []
  );

  const deleteVariable: VariableStoreContext["deleteVariable"] = useCallback(
    (id) => {
      setState((prev) => {
        const remaining = prev.variables.filter((v) => v.id !== id);
        const selectedVariableId =
          prev.selectedVariableId === id ? undefined : prev.selectedVariableId;
        return {
          ...prev,
          variables: remaining,
          selectedVariableId,
        };
      });
    },
    []
  );

  const selectVariable: VariableStoreContext["selectVariable"] = useCallback(
    (id) => {
      setState((prev) => ({
        ...prev,
        selectedVariableId: id,
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

