# Automawow!

Interactive automata simulator for Theory of Computation. Built with React + TypeScript + Vite.

**Live Demo:** [automawow.vercel.app](https://automawow.vercel.app)

## Features

- **Visual graph editor** — add states, draw transitions, drag to reposition
- **Interactive Zoom Controls** — zoom in/out, slide zoom, or reset to 100% using the premium visual zoom bar overlay
- **DFA simulator** — run or step through input strings with tape visualization
- **Regex to NFA** — Thompson's construction from regular expressions with dynamic node-spacing based on state count to prevent crowding
- **NFA to DFA** — subset construction with conversion table
- **NFA string testing** — simulate with active state-set highlighting
- **DFA minimization** — Hopcroft's algorithm with partition refinement steps
- **Visual DFA Equivalence (Split-Screen)** — draw two DFAs side-by-side on left/right canvasses and compare them directly. Includes actions to copy states and swap canvases instantly.
- **Custom React Modals** — styled custom modals (prompts/confirms) with glassmorphism backgrounds, entry animations, auto-focus, and full keyboard control (Enter/Esc) to replace native browser popups
- **Import / Export** — JSON format (detects and exports correct NFA/DFA structures)

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Tech Stack

React 18 · TypeScript · Tailwind CSS · SVG (no graph library)
