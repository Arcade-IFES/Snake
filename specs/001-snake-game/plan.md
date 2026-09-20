# Implementation Plan: Snake — Educational Arcade Game

**Branch**: `001-snake-game` | **Date**: 2026-09-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-snake-game/spec.md`

## Summary

Build Snake as a zero-install browser game: one `index.html` (inline CSS and JavaScript) plus a separate
`perguntas.js` question bank. The board is drawn on a Canvas 2D element at a fixed 20x20 logical grid. A
single fixed-step game loop advances the snake only in play time, so pause, questions, and resume countdowns
freeze every timer. All screens (title, play, pause, question, result, game over, initials, ranking) are one
explicit state machine. Sound and music are synthesized with the Web Audio API. The ranking and the mute
choice live in `localStorage` behind small load/save functions that tolerate missing storage. The version is
one constant shown in the game. A GitHub Actions workflow publishes a semantic-version tag as a GitHub Release
after checking that the tag matches that constant. A Portuguese README documents the game.

## Technical Context

**Language/Version**: HTML5, CSS3, and vanilla JavaScript (ES2020, classic scripts, no modules)

**Primary Dependencies**: None at runtime or build time. Browser APIs only: Canvas 2D, Web Audio, Web Storage,
Pointer/Touch events, Page Visibility

**Storage**: Browser `localStorage`, two keys (ranking and sound preference), behind `carregarRanking`,
`salvarRanking`, `carregarMudo`, and `salvarMudo`; all reads and writes wrapped in try/catch

**Testing**: Manual quickstart scenarios on desktop and phone, plus a dependency-free self-test of the pure
game-logic functions that runs in the browser when the page is opened with `#teste` and prints pass/fail to
the console and the page

**Target Platform**: Current desktop browsers (keyboard) and mobile browsers (touch), opened directly from
the file system or from GitHub Pages-style static hosting, offline

**Project Type**: Single-page browser game (static files, no server)

**Performance Goals**: Smooth rendering at the display refresh rate (target 60 fps on a mid-range phone);
input applied within one tick; no allocation-heavy work inside the frame loop

**Constraints**: Must open by double-clicking `index.html` (`file://`), so no ES modules, no `fetch` of local
files, no service worker; must work offline; all player text in pt-BR; source code and comments in
Portuguese; only original or licensed content

**Scale/Scope**: 1 HTML file (~1,200 lines), 1 question file (60+ questions), 9 screens, 6 sound effects, 1
music loop, 1 release workflow, 1 README

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Status | How the plan satisfies it |
|------|--------|---------------------------|
| I. Language | Pass | Spec Kit files in English; on-screen text, questions, README, source identifiers and comments in Portuguese |
| II. Technology Stack | Pass | Plain HTML/CSS/JS, no build, no server, classic scripts so `file://` works; no external fonts (system monospace stack) |
| III. Arcade Identity | Pass | Cabinet-style frame, pixel look, short matches, immediate feedback; difficulty, controls, and devices defined in Part II and the spec |
| IV. Sound | Pass | Web Audio synthesis only, no audio files; mute via `M` and an on-screen button; choice stored in `localStorage` |
| V. Ranking | Pass | Top 10, three-letter initials, `localStorage` only; game runs when storage is blocked |
| VI. Question Bank Contract | Pass | `perguntas.js` declares `const PERGUNTAS = [{ q, a, e, m }, ...]`; missing/empty file shows a warning and disables "Jogar" |
| VII. Educational Purpose | Pass | Correct answer plus explanation always shown; wrong answer only applies a temporary downgrade; game-over review lists mistakes |
| VIII. Content Originality | Pass | Original questions and synthesized audio; credits in README |
| IX. Versioning and Releases | Pass | `VERSAO` constant shown on screen; `v*.*.*` tag triggers Release workflow that verifies the tag against the constant |
| X. Spec-Driven Workflow | Pass | Spec, plan, tasks precede code; branch `001-snake-game`; `specs/001-snake-game/` committed with code |
| XI. Quality Gates | Pass (at merge) | Quickstart covers desktop, phone, sound and mute; README updated; second reviewer required on the PR |
| S-I to S-VII (Part II) | Pass | Mapped to spec FR-001 to FR-060; speed cap 16 moves/s enforced in one function used by base speed and by the downgrade |

No violations, so Complexity Tracking is empty.

**Post-design re-check (after Phase 1)**: Pass. The contracts add no server, dependency, or build step.

## Project Structure

### Documentation (this feature)

```text
specs/001-snake-game/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── perguntas.md
│   ├── armazenamento.md
│   └── versao-e-release.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html               # The whole game: markup, inline CSS, inline JavaScript (VERSAO constant here)
perguntas.js             # Question bank, edited by educators; loaded by a classic <script> tag
README.md                # Portuguese README: how to play, how to run, how to edit questions, credits
.github/
└── workflows/
    └── release.yml      # Tag-triggered GitHub Release workflow
```

**Structure Decision**: a flat single-project layout. The constitution asks for a single game HTML file plus
`perguntas.js`, so there is no `src/` or `tests/` tree. Inside `index.html`, the script is organized in
labeled sections in this order: constants (`VERSAO`, grid, speeds, timings, scores), pure logic (movement,
collision, speed, combo, effects, question drawing), storage, audio, input, rendering, state machine, and
start-up. Keeping pure logic apart from rendering and audio lets the `#teste` self-test call it without a
browser UI.

**Screens and state machine**: `TITULO`, `JOGANDO`, `PAUSADO`, `CONTAGEM`, `PERGUNTA`, `RESULTADO`,
`FIM`, `INICIAIS`, `RANKING`. Only `JOGANDO` advances the snake and the effect timers; every other state
freezes them (FR-031).

**Game loop**: `requestAnimationFrame` with a fixed-step accumulator. The step length is `1 / velocidade`
seconds and is recomputed each tick from base speed and the active effect, then capped by one function,
`limitarVelocidade`, at 16 moves per second (FR-010). Effect durations are decremented by the same play-time
delta, never by wall-clock time.

**Rendering**: one `<canvas>` for the board, sized from the container so cells stay square, scaled by
`devicePixelRatio`. The HUD (Pontos, Combo, Tamanho, Efeito, version) and overlays are HTML elements placed
around the canvas, which keeps text crisp and accessible; the question and result screens are HTML overlays
with large tap targets.

**Input**: keyboard (`keydown`) for arrows, WASD, 1-4, P, Esc, M, Enter, Space; touch through `touchstart` and
`touchend` on the board with a 24 px swipe threshold and `touch-action: none` so the page never scrolls or
zooms; on-screen direction buttons and a pause button shown on touch devices. A two-slot direction queue
applies one change per tick (FR-006).

**Audio**: one lazily created `AudioContext`, resumed on the first user gesture. Effects are short oscillator
envelopes. Music is a looping square/triangle melody scheduled with a short look-ahead so it stays in time.
Everything goes through one master gain that the mute control sets to zero.

## Complexity Tracking

No constitution violations to justify.
