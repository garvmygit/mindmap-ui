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

Production build

```bash
npm run build
```

Deploying to Render (Static Site)

1. Create a new Static Site in Render.
2. Connect your GitHub repository `garvmygit/mindmap-ui`.
3. Use the following settings:
	- Build Command: `npm install && npm run build`
	- Publish Directory: `dist`
4. Deploy — Render will build and publish the `dist` folder.

Notes & checks
- `vite.config.ts` sets `base: './'` so assets are referenced with relative paths (suitable for static hosts).
- Ensure no `console.log` or dev-only code remains before committing.
- The app is a purely static SPA — no Node runtime required.

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
