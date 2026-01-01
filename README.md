# Mindmap App

Tech stack: React + Vite + TypeScript + D3 + Tailwind CSS (dark)

Quick start

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

Project structure

- `data/mindmap.json` — single JSON source of truth
- `src/components` — UI components
- `src/hooks/useMindmap.tsx` — data and state management
- `src/utils/layout.ts` — D3 layout helpers

Features implemented

- Data-driven generation from `data/mindmap.json`
- Radial tree layout using D3
- Zoom & pan (basic)
- Hover tooltip, select node, expand/collapse
- Sidebar with edit fields (title & description)
- Expand All / Collapse All buttons
- Color-coded nodes by depth

Next steps (optional)

- Add animated transitions for node enter/exit
- Export PNG via SVG serialization
- Improve fit-to-view behavior
- Add unit tests and E2E tests
