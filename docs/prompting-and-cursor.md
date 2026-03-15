## Prompting & Cursor Usage

This document explains **how AI assistance and prompting were used** to build and refine the PDF Variable Mapper, so the process is transparent when you review the GitHub repository.

---

### 1. Environment

- **Editor**: Cursor
- **Model**: Cursor’s Opus‑class coding model (Claude was **not** used).
- **Role**: The assistant was used as a **coding agent** with access to:
  - Read and patch files in this repository.
  - Run lint checks when needed.
  - Propose and write documentation.

The agent was instructed to:

- Prefer small, incremental changes over large rewrites.
- Always read existing files before editing.
- Keep UI, behavior, and documentation consistent.

---

### 2. Prompting approach (high level)

The project was developed through a sequence of focused prompts, roughly in this order:

1. **Context discovery**
   - Ask the agent to scan the repo, identify key files, and summarize the existing behavior:
     - `MainContent`, `Sidebar`, `PdfCanvas`, `Inspector`, `variableStore`.
   - Outcome: shared understanding of the 3‑panel layout and state model.

2. **Feature alignment**
   - Provide the high‑level requirements:
     - PDF upload.
     - Drag‑and‑drop variable placement.
     - Inspector editing and JSON export.
     - Extra‑credit ideas (undo/redo, validation, strict schema).
   - Ask the agent which parts are already implemented and which are still missing.

3. **UI redesign**
   - Prompt: “Redesign the UI to look like a professional SaaS PDF tool (DocuSign‑style) while keeping the existing behavior.”
   - Constraints:
     - Keep the current component structure.
     - Use Tailwind + CSS variables.
     - Avoid breaking existing drag‑and‑drop behavior.
   - Changes made:
     - Dark gradient background.
     - Glassy header, sidebar, and inspector panels.
     - New toolbar above the PDF canvas (page navigation + zoom).

4. **Documentation scaffolding**
   - Prompt: “Create a docs folder and, for each feature, add 2 markdown files: one technical, one non‑technical.”
   - The agent:
     - Listed core features (upload, variable placement, inspector, template export).
     - Created:
       - `docs/features/*technical.md`
       - `docs/features/*nontechnical.md`
     - Wrote concise but precise descriptions of behavior and internal data flow.

5. **README & repo hygiene**
   - Prompt: “Replace the default Next.js README with a project‑specific one and describe how the AI and Cursor were used.”
   - The agent:
     - Replaced `README.md` with:
       - Overview + features.
       - Tech stack and setup.
       - Project structure.
       - Future work / extra‑credit notes.
       - Git workflow suggestions.
       - A pointer back to this `docs/prompting-and-cursor.md`.

---

### 3. Custom role / behavior guidelines

The assistant was given a persistent **coding‑agent style role**, with guidance along these lines:

- **Be action‑oriented**:
  - Don’t just suggest changes; actually apply them via file patches when appropriate.
- **Respect the codebase**:
  - Always read a file before editing.
  - Avoid deleting or overwriting large sections unless clearly needed.
- **Use good engineering practices**:
  - Keep components small and focused.
  - Avoid unnecessary comments; prefer self‑documenting code and separate docs.
  - Keep commit suggestions clean and logically grouped.
- **Documentation discipline**:
  - Every core feature should have:
    - A technical doc (implementation details).
    - A non‑technical doc (plain explanation).
  - The README must be project‑specific and not the default Next.js template.

These guidelines are not hard‑coded in the repo as a config file, but they shaped the way the assistant modified files and wrote documentation.

---

### 4. Suggested Git usage with Cursor

When working in Cursor with this project:

1. Make a small set of changes (or accept a patch proposed by the assistant).
2. Run or review tests / manual checks as needed.
3. Stage only related files:
   - UI changes.
   - Store / logic changes.
   - Docs changes.
4. Commit with a focused message, for example:
   - `feat: add inspector panel for variable editing`
   - `style: apply dark SaaS layout`
   - `docs: describe PDF upload behavior`

From there, push to a public GitHub repository (see the commands in `README.md`).

---

### 5. Claude usage disclaimer

Per the project requirements:

- **Claude was not used** at any point.
- All AI‑assisted work was done via **Cursor’s own models** and tooling inside the editor.

