# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pe5tle is a generative glitch art web application that manipulates image binary data to create artistic effects. Built with Vue 3.5, p5.js, and the p5.glitch library. Deployed on Netlify.

## Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build on port 5050
npm run lint     # ESLint 9 flat config with --fix
```

## Architecture

**Single Page Application** with Vue Router (two routes: `/` Home, `/about` About).

### Data Flow

`HomeView.vue` holds all glitch config in a `reactive()` object (`sketchData`) and shares it via `provide('sketchData')`. Child components inject it and can mutate directly — no prop drilling or emit chains needed.

A separate `provide('tab')` ref tracks which control panel is visible in the drawer.

`CanvasMain.vue` wraps a p5.js sketch using the instance pattern. It injects `sketchData` and watches it deeply with a 500ms debounce — when config changes, the entire sketch is destroyed and rebuilt (preload → setup → draw → glitch). Resize events only trigger rebuild when crossing the mobile breakpoint (768px), not on every pixel.

### File Structure

```
src/
  helpers/
    blendMode.js      — getBlendConstant() maps mode names to p5 constants
    pixelSort.js       — sortPixels() unified horizontal/vertical algorithm
    debounce.js        — simple debounce (replaces vue-debounce dependency)
    timestamp.js       — generateTimestamp() for save filenames
  composables/
    useDrawerDrag.js   — touch/mouse drag interaction for BottomDrawer
  components/
    CanvasMain.vue     — p5.js sketch wrapper + glitch engine
    BottomDrawer.vue   — drawer shell with mode selector, image/blend options
    controls/
      HexReplaceControls.vue     — Crush/Crumble/Grind byte find+replace
      RandomBytesControls.vue    — Gentle Crush/Chaos Crumble intensity
      QuantTableControls.vue     — Smoosh/Dark Smoosh quant table
      ChannelShiftControls.vue   — Fracture channel shift amount+channel
      PixelSortControls.vue      — Sift threshold+direction
  views/
    HomeView.vue       — root layout, state owner, provide/inject hub
    AboutView.vue      — static about page
```

### Glitch Modes

Nine modes implemented across CanvasMain's `glitched()` method and `draw()` post-processing:
- **Crush / Gentle Crush** — JPG byte replacement (hex vs random)
- **Crumble / Chaos Crumble** — Same but WebP format
- **Smoosh / Dark Smoosh** — JPEG quantization table (ffdb hex) modification
- **Grind** — JPG byte swap
- **Fracture** — RGB channel shift (post-processing in draw)
- **Sift** — Pixel sort by brightness threshold (post-processing in draw)

### Key Patterns

- **Composition API with `<script setup>`** throughout
- **provide/inject** for state sharing (HomeView → BottomDrawer tree)
- **Responsive**: CanvasMain manages its own `isMobile` ref via resize listener, only rebuilds on breakpoint change
- **Image handling**: display image is resized to fit canvas; a separate full-size buffer is maintained for downloads
- **Performance**: `noLoop()` (single draw), `pixelDensity(1)`, debounced watcher

### External Dependencies (CDN-loaded, not npm)

- p5.glitch v0.1.5 — pinned version loaded from jsdelivr in `index.html`
- Google Fonts (Comfortaa, Space Grotesk, JetBrains Mono)

### Styling

Dark theme with CSS custom properties in `src/assets/base.css`:
- Background: `#0f1219`, Surface: `#1a1f2e`, Accent: `#e234ab`
- Brand font: Comfortaa (bold), Body font: Space Grotesk, Mono: JetBrains Mono
- All components use plain scoped CSS (no preprocessor)

## Path Alias

`@` maps to `src/` (configured in `vite.config.js`).
