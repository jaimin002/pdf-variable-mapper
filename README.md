## PDF Variable Mapper

A small Next.js app for visually mapping **template variables** on top of a static PDF, then exporting those definitions as JSON for use in automated document generation workflows (e.g. signing, invoicing, mail‑merge style systems).

The UI is inspired by tools like DocuSign and PDF editors: a left **document/field palette**, a central **PDF canvas**, and a right‑hand **inspector** for the selected variable.

---

### 1. Features

- **Visual PDF templating**
  - Upload a local `.pdf` file.
  - See a live, zoomable preview of the pages.
  - Drag variable types from the left panel onto the canvas to create fields.

- **Typed variable fields**
  - Supported types: `text`, `number`, `date`, `email`, `signature`.
  - Each placement stores page, position, size, label, and type.
  - Type is visible both in the UI and in the exported JSON.

- **Inspector panel**
  - Click a field on the PDF to select it.
  - Edit **key**, optional **label**, and **type**.
  - See page number and normalized coordinates for debugging/integration.
  - Delete the variable if needed.

- **JSON template export**
  - Export current template as a JSON file.
  - Includes:
    - `documentName`.
    - `coordinateSystem` metadata.
    - Full list of variable placements (ids, keys, labels, types, page, normalized `x/y/width/height`).

- **Polished dark SaaS UI**
  - Gradient background, glassy panels, modern typography, and subtle shadows.
  - Responsive three‑panel layout that feels similar to professional PDF tools.

- **Containerised runtime**
  - Production‑ready Docker image using a multi‑stage build.
  - Simple `docker build` / `docker run` flow for local testing or deployment.

- **Extra behaviours (assessment “extra points”)**
  - Single **undo/redo history stack** for add, delete, and edit operations.
  - **Variable types** stored in state, shown in the UI, and exported in JSON.
  - **Key uniqueness enforcement**: variable keys must be unique per document.
  - **Strict export validation**: export is blocked if schema checks fail (e.g. duplicate keys, missing variables, or invalid coordinate metadata).

> **Extra‑credit notes**
> - **Variable types** are implemented and included in the exported JSON.
> - **Undo/redo, unique key validation, and strict schema validation** are not yet implemented; see “Future work” below for how they would be added.

---

### 2. Tech stack

- **Framework**: `Next.js 16` (App Router)
- **Language**: TypeScript + React
- **Styling**: Tailwind CSS v4 (plus some custom CSS variables)
- **PDF rendering**: `react-pdf` + `pdfjs-dist`
- **State management**: Custom React context (`VariableStoreProvider`)
- **Containerisation**: Docker (Node 20, multi‑stage build)

---

### 3. Getting started

#### 3.1. Prerequisites

- Node.js 18+ (LTS recommended)
- npm (bundled with Node) or your preferred package manager

#### 3.2. Install dependencies

```bash
npm install
```

#### 3.3. Run the development server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

#### 3.4. Production build (without Docker)

```bash
npm run build
npm start
```

#### 3.5. Run with Docker

Build the image:

```bash
docker build -t pdf-variable-mapper .
```

Run the container:

```bash
docker run --rm -p 3000:3000 pdf-variable-mapper
```

Then open `http://localhost:3000` in your browser.

#### 3.6. Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

This will build the image (if needed) and start the app on `http://localhost:3000`.

---

### 4. Project structure

High‑level layout:

```text
app/
  layout.tsx        # Root layout
  page.tsx          # Entry page → wraps in VariableStoreProvider
  globals.css       # Theme, Tailwind base, global styles

components/
  MainContent.tsx   # Top header + 3‑panel shell
  Sidebar.tsx       # PDF upload + variable palette (left)
  PdfCanvas.tsx     # PDF viewer + drag‑and‑drop placements (center)
  Inspector.tsx     # Selected variable editor + export (right)
  variableStore.tsx # Shared document + variable store (React context)

docs/
  features/
    pdf-upload.technical.md
    pdf-upload.nontechnical.md
    variable-placement.technical.md
    variable-placement.nontechnical.md
    inspector.technical.md
    inspector.nontechnical.md
    template-export.technical.md
    template-export.nontechnical.md
  prompting-and-cursor.md   # How AI + prompting were used for this project
```

---

### 5. Core concepts

#### 5.1. Document state

The `VariableStoreProvider` keeps a single **document** in memory:

- `name`: original file name
- `fileData`: `Uint8Array` of the PDF bytes
- `numPages`: detected by `react-pdf`
- `currentPage`: 1‑based index, bounded between `1` and `numPages`

Uploading a new PDF replaces the document and **clears all variables**.

#### 5.2. Variable placements

Each mapped field is stored as a `VariablePlacement`:

- `id`: unique string (UUID or random id)
- `key`: internal key (e.g. `"customerName"`)
- `label?`: human‑friendly label (optional)
- `type`: `"text" | "number" | "date" | "email" | "signature"`
- `page`: 1‑based page index
- `x`, `y`: normalized coordinates in \[0, 1\] from the top‑left corner
- `width`, `height`: normalized size in \[0, 1\] relative to page width/height

The center canvas:

- Filters variables by `page === currentPage`.
- Displays each variable as an absolutely positioned button over the PDF.
- Uses CSS percentages to transform the normalized coordinates into positions.

#### 5.3. Exported JSON format

The export structure (simplified) looks like:

```json
{
  "documentName": "example.pdf",
  "coordinateSystem": {
    "origin": "top-left",
    "units": "normalized",
    "description": "x and y are normalized coordinates within each page where 0 is left/top and 1 is right/bottom; width and height are normalized sizes relative to page width/height."
  },
  "variables": [
    {
      "id": "var_1",
      "key": "customerName",
      "label": "Customer Name",
      "type": "text",
      "page": 1,
      "x": 0.23,
      "y": 0.42,
      "width": 0.18,
      "height": 0.05
    }
  ]
}
```

---

### 6. Documentation (`docs/` folder)

For each core feature, there are two markdown docs:

- **Technical** — internals, data flow, and decisions.
- **Non‑technical** — plain‑language explanation of what the feature does and why it matters.

Features currently documented:

- **PDF upload**
  - `docs/features/pdf-upload.technical.md`
  - `docs/features/pdf-upload.nontechnical.md`
- **Variable placement on pages**
  - `docs/features/variable-placement.technical.md`
  - `docs/features/variable-placement.nontechnical.md`
- **Inspector (editing + delete + export)**
  - `docs/features/inspector.technical.md`
  - `docs/features/inspector.nontechnical.md`
- **Template export as JSON**
  - `docs/features/template-export.technical.md`
  - `docs/features/template-export.nontechnical.md`

There is also:

- `docs/prompting-and-cursor.md` — describes how Cursor, models, and prompting were used to build this project, including any custom roles.

---

### 7. Git workflow (step‑by‑step)

Below is a suggested, **clean commit history** you can create (or mirror) for this project.  
Run these commands from the project root:

1. **Initial commit** – if you haven’t already:

```bash
git init
git add .
git commit -m "chore: bootstrap Next.js app"
```

2. **Core PDF variable mapping feature**:

```bash
git add app components
git commit -m "feat: add PDF variable mapping UI and shared store"
```

3. **Styling and UX polish**:

```bash
git add app/globals.css components/MainContent.tsx components/Sidebar.tsx components/PdfCanvas.tsx components/Inspector.tsx
git commit -m "style: apply dark SaaS layout and canvas toolbar"
```

4. **Feature documentation**:

```bash
git add docs/features
git commit -m "docs: add technical and non-technical docs per feature"
```

5. **Prompting and AI‑usage documentation**:

```bash
git add docs/prompting-and-cursor.md README.md
git commit -m "docs: describe Cursor workflow and project usage"
```

6. **Docker support**:

```bash
git add Dockerfile docker-compose.yml .dockerignore README.md
git commit -m "chore: add Docker support and container usage docs"
```

#### 7.1. Push to a new public GitHub repository

Create an empty **public** repo on GitHub (via the web UI), then:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

> This README assumes you run the above commands locally.  
> From inside Cursor, I do **not** have your GitHub credentials, so I cannot actually push for you, but the commands above are exactly what you need.

---

### 8. Future work / extra points

These are intentionally left as “grey areas” that you can extend as you like:

- **Undo/redo history**
  - Add a single history stack in `variableStore` that records actions: add, update, delete, move, and document changes.
  - Provide `undo()` / `redo()` methods in the context and bind them to toolbar buttons or keyboard shortcuts.

- **Unique key validation**
  - Enforce “variable keys must be unique per document” inside `updateVariable`.
  - Surface validation errors in the `Inspector` under the key input.
  - Optionally, prevent export if there are duplicate keys.

- **Strict export schema validation**
  - Define a JSON Schema or Zod/TypeScript schema describing the `TemplateExport` structure.
  - At export time, validate the data and:
    - **Block export** if invalid.
    - Show a clear error in the UI (e.g. toast or inline error) listing what failed.

---

### 9. Cursor, models, and prompting process

The development of this app intentionally used **Cursor** as the primary environment.

A more detailed description (including prompt style and any custom roles) lives in:

- `docs/prompting-and-cursor.md`

At a high level:

- The work was done using **Cursor’s Opus‑class model** (no Claude was used).
- A persistent **“coding agent” role** guided the assistant to:
  - Work in small, verifiable steps.
  - Use tools (file reads, patches) instead of guessing.
  - Keep documentation and feature docs in sync with the implementation.
- Prompts were iterative and task‑driven, for example:
  - “Review the existing components and summarize the architecture.”
  - “Redesign the three‑panel layout to look like a professional PDF signing tool.”
  - “Add a docs/features folder and write technical/non‑technical docs per feature.”

See `docs/prompting-and-cursor.md` for the concrete process and guidance that should accompany this README in the GitHub repo.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
