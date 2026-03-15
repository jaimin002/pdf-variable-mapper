## Variable Inspector & Editing (Technical)

### Purpose
Provide a dedicated panel to inspect and edit properties of a single selected variable and trigger template export.

### Behavior
- The `Inspector` component consumes shared state via `useVariableStore`.
- It derives the currently selected variable by matching `selectedVariableId` against `variables`.
- If **no variable is selected**:
  - Shows an instructional empty state.
- If **a variable is selected**:
  - Renders a details card with:
    - Key (text input, bound to `selected.key`).
    - Label (optional text input, bound to `selected.label`).
    - Type (select dropdown over `VariableType` union).
    - Read-only info: `page`, `x`, `y` (with coordinates rounded for readability).
  - Provides actions:
    - **Export JSON** – calls `exportTemplate()` and downloads the result as a `.json` file.
    - **Delete Variable** – calls `deleteVariable(selected.id)`.

### Data Flow
- **Inputs**: `variables`, `selectedVariableId`, `updateVariable`, `deleteVariable`, `exportTemplate`.
- **Outputs**:
  - State updates via `updateVariable` and `deleteVariable`.
  - A JSON file download using a `Blob` and object URL when exporting.

### Key Constraints & Decisions
- Editing is **single-selection only**; the inspector always refers to exactly one variable or none.
- The inspector does not change coordinates or size in this version; it focuses on identity (key/label/type) and management (delete/export).

