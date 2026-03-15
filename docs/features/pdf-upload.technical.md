## PDF Upload & Document State (Technical)

### Purpose
Allow users to upload a PDF file and initialize the shared document state used across the app.

### Behavior
- Accepts a single `.pdf` file from the user (via file input).
- Reads the file as an `ArrayBuffer`, converts it to `Uint8Array`, and stores it in the global `VariableStore` as `document.fileData` with the original file name.
- Resets:
  - `document.numPages` to `0` (updated later by the PDF renderer).
  - `document.currentPage` to `1`.
  - All existing variable placements and the current selection.

### Data Flow
- **Source**: `Sidebar` component file input.
- **Store**: `setPdfDocument({ name, data })` in `variableStore`.
- **Consumers**:
  - `PdfCanvas` uses `document.fileData` to build a `Blob` + object URL for `react-pdf`.
  - `Inspector` uses `document.name` when naming the exported JSON file.

### Key Constraints & Decisions
- Only one PDF is active at a time; uploading a new PDF clears all variables.
- The original file is never sent to a backend; all processing happens in the browser.

