# Research: Snake — Educational Arcade Game

No `NEEDS CLARIFICATION` items remained in the Technical Context. The decisions below record the choices that
the constitution and the spec leave open, so later phases do not re-litigate them.

## R1. Loading the code from `file://`

- **Decision**: Use classic `<script>` tags. `perguntas.js` is loaded with `<script src="perguntas.js">`
  before the inline game script and declares a global `const PERGUNTAS`. No ES modules, no `fetch`.
- **Rationale**: Browsers block module scripts and `fetch` of local files from `file://`, which would break
  the "open by double-clicking" rule (Principle II). A global `const` in a classic script is visible to the
  inline script that follows.
- **Alternatives considered**: ES modules (blocked on `file://`); loading questions as JSON with `fetch`
  (blocked, and violates the `perguntas.js` contract); inlining questions in `index.html` (breaks Principle VI).

## R2. Detecting a missing or broken question bank

- **Decision**: Check `typeof PERGUNTAS !== "undefined"` (a missing file leaves the name undefined), then
  validate each entry. A failed `<script>` load is also caught with the script element's `onerror`.
- **Rationale**: Covers a deleted file, an empty array, and a syntax error, all with the same warning
  ("Perguntas não encontradas. Verifique o arquivo perguntas.js.") and a disabled "Jogar" button (FR-053).
- **Alternatives considered**: try/catch around the whole game (hides real bugs).

## R3. Fixed-step loop that freezes on pause

- **Decision**: `requestAnimationFrame` plus an accumulator; only the `JOGANDO` state adds elapsed time to it.
  Elapsed time per frame is clamped to 100 ms so a background tab or slow frame cannot cause a jump.
- **Rationale**: Keeps movement deterministic, makes pause, question and resume-countdown trivial (they simply
  do not add time), and prevents the snake from teleporting after a stall.
- **Alternatives considered**: `setInterval` per tick (drifts, and speed changes need re-arming); CSS animation
  (poor control over collision timing).

## R4. Speed rules in one place

- **Decision**: One pure function computes the moves-per-second: `min(6 + 0.15 * frutas, 12)` as base, then the
  active effect (`x0.5` for "Câmera lenta", `x1.4` for "Turbo"), then `limitarVelocidade` clamps to 16.
- **Rationale**: The constitution's maximum speed rule (S-II) and FR-010 are then enforced by one line that is
  easy to test.
- **Alternatives considered**: Applying multipliers where used (risks a path that skips the cap).

## R5. Drawing the board

- **Decision**: Canvas 2D, logical grid 20x20, cell size = `floor(min(largura, altura) / 20)` of the available
  area, canvas backing store scaled by `devicePixelRatio`, `image-rendering: pixelated` look with square
  rectangles (no images).
- **Rationale**: Square cells at any size (FR-059), crisp on high-density phone screens, and zero assets.
- **Alternatives considered**: DOM grid of 400 cells (heavier to update); SVG (no benefit here).

## R6. Touch input

- **Decision**: `touchstart`/`touchend` on the board compute the dominant axis of the swipe, ignoring moves
  under 24 px; the board has `touch-action: none`; the viewport meta blocks zoom; on-screen arrow buttons use
  `pointerdown`.
- **Rationale**: Prevents page scroll and pinch zoom during play (FR-016) and works on all current mobile
  browsers without libraries.
- **Alternatives considered**: Pointer events for swipe only (touch scroll suppression is less reliable on
  some browsers); gesture libraries (dependencies are not allowed).

## R7. Synthesized audio

- **Decision**: One `AudioContext` created on the first gesture, a master `GainNode` for mute, oscillator
  envelopes for effects, and a looping melody scheduled 100 ms ahead using a `setTimeout` scheduler.
- **Rationale**: Meets Principle IV with no files, survives browser autoplay policies (the context is resumed on
  the first tap or key), and keeps music in time even when frames are slow.
- **Alternatives considered**: Audio files (forbidden); one oscillator per frame (glitchy).

## R8. Persistence and failure

- **Decision**: Keys `snake.ranking` and `snake.mudo`. Ranking stored as a JSON array of `{ i, p, t }`
  (initials, points, timestamp), validated on load (bad JSON or wrong shape gives an empty list). Every
  access is wrapped in try/catch; a flag `armazenamentoOk` drives "Ranking indisponível neste navegador.".
- **Rationale**: Satisfies Principle V and FR-041 to FR-045; storage can be blocked in private windows or
  by browser settings.
- **Alternatives considered**: Cookies (size and privacy issues); IndexedDB (overkill for ten rows).

## R9. Question drawing

- **Decision**: Build a shuffled queue per subject (`m`) and take from subjects in round-robin, skipping empty
  ones; when every queue is empty, rebuild from the valid bank. Show four alternatives: the correct one plus
  three random wrong ones, shuffled (Fisher-Yates).
- **Rationale**: Balanced subjects and no repeats until the bank is exhausted (FR-052), and supports banks
  where each question holds more than four alternatives.
- **Alternatives considered**: Pure random pick (repeats); per-subject weighting (unneeded complexity).

## R10. Testing without dependencies

- **Decision**: Keep the rules in pure functions and add a `#teste` mode that runs assertions on them
  (movement, no-reverse, collision, speed cap, combo, effect replacement, cycle order, ranking insertion and
  ties, question validation). The rest is covered by the manual quickstart.
- **Rationale**: The constitution forbids required build tools and dependencies, so no test framework is
  assumed; this catches logic regressions and can be run by double-clicking.
- **Alternatives considered**: Node test runner (adds a tool teachers do not have); no automated checks
  (risky for the cap and cycle rules).

## R11. Version and release

- **Decision**: `const VERSAO = "1.0.0"` in `index.html`, rendered in the HUD and title screen as `v1.0.0`. A
  GitHub Actions workflow triggers on tags matching `v*.*.*`, extracts `VERSAO` from `index.html`, fails if it
  differs from the tag, then creates a Release with generated notes and attaches a zip of `index.html`,
  `perguntas.js`, and `README.md`, using the `gh` CLI that is pre-installed on GitHub runners.
- **Rationale**: One source of truth for the number (Principle IX), and a tag that does not match the game
  cannot be published by mistake. Using `gh` avoids third-party actions.
- **Alternatives considered**: Third-party release actions (extra supply-chain surface); reading the version
  from a separate `version.txt` (two sources of truth).

## R12. Fonts and look

- **Decision**: A system monospace font stack, with pixel-style borders drawn in CSS and a dark CRT-like
  palette with high contrast.
- **Rationale**: No external fonts means it works offline with no fallback logic (Principle II) and the arcade
  identity comes from layout and color.
- **Alternatives considered**: A web font with fallback (allowed but adds a network dependency).
