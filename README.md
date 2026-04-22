# Phaser 3 — TypeScript + Webpack Template

A production-ready starter template for building browser games with **Phaser 3**, **TypeScript**, and **Webpack 5**.

---

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Phaser 3](https://phaser.io) | 3.90 | Game engine |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Type-safe game code |
| [Webpack](https://webpack.js.org) | 5.88 | Bundler (dev server + prod build) |
| [ESLint](https://eslint.org) | 8.57 | Linting |
| [Prettier](https://prettier.io) | 3.8 | Code formatting |
| [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) | 5.3 | Bundle size inspection |

---

## Project Structure

```
game/
├── src/
│   ├── scenes/          # Phaser scenes (Boot, Preloader, Menu, Game, Transition)
│   ├── gui/             # UI components (Button, Text, Sprite, Container, ...)
│   │   └── basic/       # Base reusable Phaser display objects
│   ├── audio/           # Audio manager
│   ├── locale/          # i18n (en / ru)
│   ├── scaling/         # Orientation alert for mobile
│   ├── events/          # Event bus and bridge
│   ├── utils/           # Math, color, easing, FSM, logging helpers
│   ├── data/            # Config, params, audio data
│   ├── interfaces/      # Shared TypeScript interfaces
│   └── index.ts         # Entry point
├── public/              # Static assets (copied as-is to build/)
├── configs/             # Webpack configs (common / dev / prod)
├── build/               # Production output (generated)
└── package.json
```

---

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org) (LTS recommended)

```sh
# 1. Clone the repository
git clone https://github.com/your-username/phaser3-ts-webpack.git
cd phaser3-ts-webpack/game

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run dev:open` | Start dev server and open browser automatically |
| `npm run build:prod` | Production build → `build/` |
| `npm run build:analyze` | Production build + bundle size visualization |
| `npm run type-check` | TypeScript type checking without emit |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format source files with Prettier |

---

## Features

- **Scene flow** — Boot → Preloader → Menu → Game, with a dedicated Transition scene
- **Base UI components** — `MyButton`, `MyText`, `MySprite`, `MyImage`, `MyContainer`, `MyGraphics`
- **Finite State Machine** — `FSM` and `StackFSM` utilities for game logic
- **Audio manager** — centralized sound control via `AudioMng`
- **Localization** — English and Russian out of the box; easily extendable
- **Orientation alert** — mobile-friendly landscape/portrait detection
- **Logging** — `LogMng` with configurable log levels
- **Path aliases** — TypeScript path aliases wired into Webpack via `tsconfig-paths-webpack-plugin`
- **CSS / SCSS support** — style-loader, css-loader, sass-loader included
- **Asset hashing** — content-hashed filenames for cache busting in production
- **Dev tools** — `dat.gui` and `stats-js` available for in-game debugging

---

## Recommended IDE

[Visual Studio Code](https://code.visualstudio.com) — a `.code-workspace` file is included with recommended settings.

---

## License

[ISC](LICENSE)
