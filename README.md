# pe5tle

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A generative glitch art web app that manipulates image binary data to create artistic effects.

Built with [Vue 3](https://vuejs.org/), [p5.js](https://p5js.org/), and [p5.glitch](https://p5.glitch.me/).

Special thanks to [ffd8](https://github.com/ffd8) for inspiring this project with the [p5.glitch](https://p5.glitch.me/) library and the feedback, and my little brother Leon for thinking it was cool and giving me suggestions.

## Glitch Modes

| Mode | Effect |
|------|--------|
| **Crush** | JPG byte find & replace |
| **Gentle Crush** | JPG random byte injection |
| **Crumble** | WebP byte find & replace |
| **Chaos Crumble** | WebP random byte injection |
| **Smoosh / Dark Smoosh** | JPEG quantization table modification |
| **Grind** | JPG byte swap |
| **Fracture** | RGB channel shift |
| **Sift** | Pixel sort by brightness threshold |

All modes support blend options (Darkest, Lightest, Difference, Multiply, Exclusion, Screen) to layer the glitched result with the original image.

## Getting Started

```sh
npm install
npm run dev
```

## Commands

```sh
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build on port 5050
npm run lint     # Lint and auto-fix with ESLint
```

## Tech Stack

- **Vue 3.5** with Composition API (`<script setup>`)
- **Vite 6** for dev/build tooling
- **p5.js** for canvas rendering
- **p5.glitch** (CDN) for binary image manipulation
- **ESLint 9** with flat config

## Contributing

Open to contributions! Feel free to open an issue or PR.

## Contact

Get in touch about this project at wax.alchemical@gmail.com

You can also find me on Instagram: [@three.raccoons.in.a.hoodie](https://www.instagram.com/three.raccoons.in.a.hoodie/)

Tag your work [#pe5tle](https://www.instagram.com/explore/tags/pe5tle/) if you post something made with it.
