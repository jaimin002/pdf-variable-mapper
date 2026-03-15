## Template Export as JSON (Technical)

### Purpose
Expose the current template (document metadata + variable placements) as a structured JSON file that can be consumed by other systems.

### Behavior
- `exportTemplate` in `variableStore` builds a `TemplateExport` object containing:
  - `documentName?`: the current PDF’s name, if available.
  - `coordinateSystem`:
    - `origin: "top-left"`.
    - `units: "normalized"`.
    - `description`: human‑readable explanation of how `x`, `y`, `width`, `height` work.
  - `variables`: a deep copy of the current `variables` array.
- The `Inspector` component:
  - Calls `exportTemplate()` when the user triggers export.
  - Serializes the object with `JSON.stringify(template, null, 2)`.
  - Wraps it in a `Blob` with MIME type `application/json`.
  - Uses an object URL + temporary `<a>` tag to download a file named `<documentName>.json` (or `template.json` as fallback).

### Output Shape
- The exported JSON is intentionally:
  - **Self‑describing** with coordinate system metadata.
  - **Stable**: every variable includes ID, key, type, page, normalized coordinates, and normalized size.

### Key Constraints & Decisions
- Export is entirely **client‑side**; no network requests are made.
- Normalized coordinates ensure the template is usable across different render resolutions.

