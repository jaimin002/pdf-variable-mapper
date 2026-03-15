## Variable Placement on PDF Pages (Technical)

### Purpose
Enable users to place typed variables onto specific locations of a PDF page using drag-and-drop, backed by normalized coordinates.

### Behavior
- Variable “types” are initiated in `Sidebar` and dragged onto the `PdfCanvas`.
- On drop, the canvas:
  - Reads the type from `dataTransfer` (`application/x-variable-type`).
  - Computes the pointer position within the canvas container and converts it to normalized `x` and `y` in \[0, 1\].
  - Clamps coordinates to the \[0, 1\] range to avoid overflow.
  - Calls `addVariableAt({ page, x, y, type })` on the shared store.
- Default `width` and `height` are assigned in the store (`0.18` and `0.05` of page size).

### Data Model
- Each placement is a `VariablePlacement`:
  - `id`: unique string (UUID or random fallback).
  - `key`: defaulted to `var_<n>`; user-editable later.
  - `label?`: optional display label.
  - `type`: `"text" | "number" | "date" | "email" | "signature"`.
  - `page`: `number` (1-based page index).
  - `x`, `y`: `number` normalized coordinates relative to top-left origin.
  - `width`, `height`: `number` normalized sizes relative to page dimensions.

### Rendering
- `PdfCanvas` filters variables by `page === document.currentPage`.
- For each variable:
  - Renders an absolutely positioned button over the PDF preview.
  - Translates normalized coordinates to CSS percentages for `left`, `top`, `width`, `height`.
  - Applies styles based on whether the variable is currently selected.

### Key Constraints & Decisions
- Positions and sizes are stored in **normalized units** to be independent of actual pixel dimensions.
- Drag-and-drop is **one-way** (from palette to canvas); variables are not yet draggable to reposition (in this version).

