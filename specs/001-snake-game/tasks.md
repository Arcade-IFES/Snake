---

description: "Task list for the Snake educational arcade game"
---

# Tasks: Snake — Educational Arcade Game

**Input**: Design documents from `/specs/001-snake-game/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: The plan requires a dependency-free logic self-test that runs when `index.html` is opened with
`#teste`. Its tasks are included per story. No test framework is used, in line with the constitution.

**Organization**: Tasks are grouped by user story so each story can be implemented and checked on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on unfinished tasks)
- **[Story]**: The user story the task belongs to (US1 to US7)
- Every task names the exact file. Source identifiers and comments MUST be in Portuguese (Principle I);
  every text shown to the player MUST be in pt-BR.

## Path Conventions

Flat single project at the repository root, as fixed by plan.md:

- `index.html`: the whole game (markup, inline CSS, inline JavaScript)
- `perguntas.js`: question bank
- `README.md`: Portuguese README
- `.github/workflows/release.yml`: release workflow

`index.html` is one file, so tasks that edit it are NOT marked [P] against each other. Inside `index.html`
each task adds code to the labeled section named in the task, in this order: constantes, lógica pura,
armazenamento, áudio, entrada, desenho, máquina de estados, início.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the files and the section layout described in plan.md.

- [ ] T001 Create `index.html` with `<!DOCTYPE html>`, `<html lang="pt-BR">`, a viewport meta tag that
  blocks zoom, an empty `<canvas id="tabuleiro">`, an inline `<style>` block, `<script src="perguntas.js">`
  followed by one inline `<script>` divided into the eight labeled comment sections in the order listed
  above, and the single line `const VERSAO = "1.0.0";` in the constantes section
- [ ] T002 [P] Create `perguntas.js` containing only a header comment in Portuguese that explains the
  `{ q, a, e, m }` format (first alternative always correct) and `const PERGUNTAS = [];`
- [ ] T003 [P] Create `README.md` as a Portuguese skeleton with the headings: "O que é", "Como jogar",
  "Como abrir", "Como editar as perguntas", "Créditos", "Versões"

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shell, loop, and helpers that every story uses.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Add every constant from data-model.md to the constantes section of `index.html`: 20 columns by
  20 rows, start length 3, base speed 6 / +0.15 per fruit / cap 12 moves per second, absolute maximum 16 moves
  per second, 5 fruits per question round, 15 s question time, 10 fruit points, 50 answer bonus, combo +1 per
  5 fruits capped at x5, 3 s resume countdown, effect durations (slow 8 s, pass-through 8 s, double 10 s,
  shield 30 s or 1 use, turbo 8 s), direction queue size 2, swipe threshold 24 px, alternative limit 40
  characters, statement limit 160 characters
- [ ] T005 Add to `index.html` the screen state machine with the states `TITULO`, `JOGANDO`, `PAUSADO`,
  `CONTAGEM`, `PERGUNTA`, `RESULTADO`, `FIM`, `INICIAIS`, `RANKING`, a `mudarEstado(novo)` function, and one
  hidden HTML overlay container per screen, shown only for the current state
- [ ] T006 Add the cabinet-style CSS to `index.html`: dark high-contrast palette, system monospace font stack
  (no external fonts), a framed board area, responsive layout that never scrolls horizontally, and the
  message "Gire o aparelho ou aumente a janela." shown instead of the game below the smallest supported size
- [ ] T007 Add `ajustarTabuleiro()` to the desenho section of `index.html`: cell size is
  `floor(min(largura, altura) / 20)` of the free area so cells stay square, canvas backing store scaled by
  `devicePixelRatio`, redrawn on resize and rotation
- [ ] T008 Add the fixed-step game loop to the máquina de estados section of `index.html`, using
  `requestAnimationFrame` and an accumulator; elapsed time per frame is clamped to 100 ms and is added only
  while the state is `JOGANDO`
- [ ] T009 Add the pure helpers to the lógica pura section of `index.html`: `velocidadeBase(frutas)` as
  `min(6 + 0.15 * frutas, 12)`, `limitarVelocidade(v)` clamping to 16, `multiplicador(combo)` as
  `min(1 + floor(combo / 5), 5)`, `embaralhar(lista)` (Fisher-Yates), and `celulaLivre(ocupadas)` returning a
  random free cell or `null` when the grid is full
- [ ] T010 Add the `#teste` self-test harness to `index.html`: when `location.hash === "#teste"`, run
  registered `testar(nome, funcao)` checks after load, print "ok" or "falhou" plus the name to the console and
  to a page panel, and do not start the game UI; add checks for `velocidadeBase`, `limitarVelocidade` (never
  above 16), `multiplicador`, `embaralhar`, and `celulaLivre`

**Checkpoint**: The page opens, resizes with square cells, has an idle loop, and the self-test runs.

---

## Phase 3: User Story 1 - Play a classic Snake match (Priority: P1) 🎯 MVP

**Goal**: A complete arcade match: steer, eat, grow, speed up, and lose on a wall or the body.

**Independent Test**: Quickstart scenario A, with the question round not yet built (no "?" fruit appears).

### Self-test for User Story 1

- [ ] T011 [US1] Add self-test checks in `index.html` for: initial match state (length 3, direction right,
  score 0, combo x1, no effect), one move per tick, growth on a regular fruit, wall collision, body collision,
  the no-reverse rule (opposite direction ignored, two turns in one tick apply one turn per tick with a queue
  of at most 2), fruits never placed on the snake, and the win when the grid is full

### Implementation for User Story 1

- [ ] T012 [US1] Add `criarPartida()` to the lógica pura section of `index.html`: snake of length 3 moving
  `DIREITA`, one regular fruit on a free cell, score 0, `frutasComidas` 0, combo 0 (multiplier x1), no effect,
  `ganhou` false
- [ ] T013 [US1] Add direction handling to `index.html`: `pedirDirecao(partida, dir)` pushes to a queue of at
  most 2 and drops any direction opposite to the last queued or applied one; each tick applies at most one
  queued direction (FR-006)
- [ ] T014 [US1] Add `passo(partida)` to the lógica pura section of `index.html`: move the head one cell;
  detect wall and body collision (game over); on a regular fruit grow by one segment, add
  `10 * multiplicador(combo)` points, increment `frutasComidas` and `combo`, and place a new fruit with
  `celulaLivre`; if no free cell exists set `ganhou` and end the match (FR-007)
- [ ] T015 [US1] Wire the loop in `index.html` so each tick interval is `1 / limitarVelocidade(
  velocidadeBase(frutasComidas))` seconds and `passo` runs once per elapsed interval
- [ ] T016 [US1] Add board drawing to the desenho section of `index.html`: walls or border, snake (distinct
  head), and regular fruit as square cells with a pixel arcade look; redraw every frame
- [ ] T017 [US1] Add keyboard steering to the entrada section of `index.html`: arrow keys and W, A, S, D call
  `pedirDirecao`; prevent default scrolling for arrow keys during play
- [ ] T018 [US1] Add the title screen to `index.html` with the title "Snake", a "Jogar" button that starts a
  match, and the arcade cabinet look; "Jogar" is enabled by default here (bank check comes in US2)
- [ ] T019 [US1] Add the game-over screen to `index.html` showing "Fim de jogo" (or "Você venceu!" when
  `ganhou`), the final score with the label "Pontos", the length with the label "Tamanho", and the buttons
  "Jogar de novo" and "Menu"

**Checkpoint**: A full match with the classic rules works on desktop with a keyboard. This is the MVP.

---

## Phase 4: User Story 2 - Answer a question round (Priority: P2)

**Goal**: The "?" fruit, the timed four-alternative question, the upgrade cycle, and the downgrade.

**Independent Test**: Quickstart scenarios B and C.

### Question bank content (perguntas.js)

Each task adds 10 original pt-BR questions to `perguntas.js` in the format `{ q, a, e, m }`: `q` non-empty and
at most 160 characters; `a` at least 4 non-empty items, each at most 40 characters, first one correct; `e` a
non-empty short explanation; `m` the subject name. Content is for Ifes students, original, and not copied from
exams or textbooks (Principle VIII). These tasks edit one file, so run them one at a time; the whole stream is
independent of the `index.html` tasks below.

- [ ] T020 [US2] Add 10 questions with `m: "Português"` to `perguntas.js`
- [ ] T021 [US2] Add 10 questions with `m: "Matemática"` to `perguntas.js`
- [ ] T022 [US2] Add 10 questions with `m: "História"` to `perguntas.js`
- [ ] T023 [US2] Add 10 questions with `m: "Geografia"` to `perguntas.js`
- [ ] T024 [US2] Add 10 questions with `m: "Ciências"` to `perguntas.js`
- [ ] T025 [US2] Add 10 questions with `m: "Conhecimentos gerais"` to `perguntas.js`, then confirm the file
  holds at least 60 questions across at least 5 subjects

### Self-test for User Story 2

- [ ] T026 [US2] Add self-test checks in `index.html` for: `validarPergunta` (accepts a valid entry; rejects
  `q` over 160 characters, fewer than 4 alternatives, an alternative over 40 characters, an empty `e` or `m`),
  question drawing (no repeats until the bank is used up, subjects balanced, restarts from the full valid bank),
  four alternatives shown with the correct one tracked after shuffling, upgrade order over 8 answers ("Câmera
  lenta", "Atravessar o corpo", "Pontos em dobro", "Escudo", then repeating), one effect at a time with
  replacement, and that a speed with any effect never exceeds 16

### Implementation for User Story 2

- [ ] T027 [US2] Add `validarPergunta(p)` and `prepararBanco()` to the lógica pura section of `index.html`:
  read `PERGUNTAS` safely (a missing file leaves it undefined), keep only valid entries, log skipped indexes
  to the console
- [ ] T028 [US2] Add the bank warning to `index.html`: if no valid question exists (file missing, empty, or
  all invalid, also when the script `onerror` fires), the title screen shows "Perguntas não encontradas.
  Verifique o arquivo perguntas.js." and "Jogar" is disabled; the game must not crash
- [ ] T029 [US2] Add `sortearPergunta(partida)` to the lógica pura section of `index.html`: per-subject
  shuffled queues drawn in round-robin, no repeat until every valid question was used, then rebuild; return
  the correct alternative plus 3 random wrong ones, shuffled, with the correct index tracked
- [ ] T030 [US2] Add the "?" fruit to `index.html`: after every 5th regular fruit spawn one special fruit on a
  free cell, at most one at a time, kept until eaten, drawn with a distinct look and a "?" mark; it neither
  grows the snake nor awards fruit points (FR-017, FR-018); if the head would hit a wall or body on the same
  move the collision wins
- [ ] T031 [US2] Add the effects module to the lógica pura section of `index.html`: `aplicarEfeito(partida,
  efeito)` (replaces the current one), effects "Câmera lenta" (speed x0.5, 8 s), "Atravessar o corpo" (body
  is not fatal for 8 s, walls stay fatal; if time ends while the head is on the body the effect stays at "0 s"
  until the head leaves it), "Pontos em dobro" (all points doubled, 10 s), "Escudo" (cancels the next one
  collision, the snake does not move that tick, ends when used or after 30 s), and the downgrade "Turbo"
  (speed x1.4, 8 s); speed is always passed through `limitarVelocidade`; durations decrease only in
  `JOGANDO`
- [ ] T032 [US2] Add the upgrade cycle to `index.html`: a per-match position over the fixed order "Câmera
  lenta", "Atravessar o corpo", "Pontos em dobro", "Escudo", repeating, restarting each match
- [ ] T033 [US2] Add the question screen to `index.html` for state `PERGUNTA`: statement, four alternatives
  labeled 1 to 4, a visible countdown from 15 s that runs only in this state, answering by keys 1 to 4 or by
  tapping an alternative, all other keys including P and Esc ignored
- [ ] T034 [US2] Add the result screen to `index.html` for state `RESULTADO`: the message "Resposta
  correta!", "Resposta errada!", or "Tempo esgotado!", the correct alternative highlighted, and the
  explanation `e`; continue with any answer key, Enter, Space, or a "Continuar" button
- [ ] T035 [US2] Add answer handling to `index.html`: correct gives 50 bonus points (not multiplied by the
  combo), counts as one consecutive fruit, and applies the next upgrade; wrong or timeout resets the combo to
  x1 and applies "Turbo"; neither can end the match; each result is stored as a question record with
  `CERTA`, `ERRADA`, or `TEMPO` (FR-020 to FR-024)
- [ ] T036 [US2] Add the resume countdown to `index.html`: state `CONTAGEM` shows 3, 2, 1 and only then
  returns to `JOGANDO`; use it after every question result

**Checkpoint**: A match with question rounds plays end to end and never ends because of an answer.

---

## Phase 5: User Story 3 - See the game state on screen (Priority: P2)

**Goal**: Always-visible score, combo, effect, length, and version.

**Independent Test**: Quickstart scenario D.

- [ ] T037 [US3] Add the HUD markup and CSS to `index.html` with the labels "Pontos", "Combo", "Tamanho",
  "Efeito" and the version text `"v" + VERSAO` (the constant from T001 is the only place the number is
  written), visible together with the board on desktop and phone
- [ ] T038 [US3] Add HUD updates to `index.html`: score, combo as the multiplier (for example "x2"), and
  length update in the same tick as the change; "Efeito" shows "Nenhum" when idle, otherwise the effect name
  and remaining seconds, or "1 uso" for the shield
- [ ] T039 [US3] Add effect announcements to `index.html`: show the effect name on screen when it starts, with
  a visually distinct style for upgrades and for the downgrade (for example different colors plus an icon
  character, not color alone)
- [ ] T040 [US3] Show `"v" + VERSAO` also on the title screen of `index.html`

**Checkpoint**: Every value in scenario D is visible and updates correctly.

---

## Phase 6: User Story 7 - Pause and resume (Priority: P3)

**Goal**: Pause with P or Esc, resume with a countdown, and pause automatically when the page is hidden.

**Independent Test**: Quickstart scenario H.

- [ ] T041 [US7] Add self-test checks in `index.html` that the play-time delta is not applied in `PAUSADO`,
  `CONTAGEM`, `PERGUNTA`, `RESULTADO` (effect timers and snake position unchanged)
- [ ] T042 [US7] Add pause to `index.html`: P or Esc toggles `JOGANDO` and `PAUSADO`, the pause screen shows
  "Pausado" and a "Continuar" button, resuming goes through the `CONTAGEM` 3-2-1; P and Esc do nothing in
  `PERGUNTA`
- [ ] T043 [US7] Add `visibilitychange` and `blur` handling to `index.html` so a match in `JOGANDO` pauses
  automatically and resumes only through the pause screen
- [ ] T044 [US7] Add an on-screen pause button to `index.html`, shown on touch devices during play, that
  toggles pause like P

**Checkpoint**: Pause freezes the snake and all timers.

---

## Phase 7: User Story 6 - Play on a phone (Priority: P2)

**Goal**: Full play on a touch device in portrait and landscape.

**Independent Test**: Quickstart scenario G (the pause button part depends on Phase 6).

- [ ] T045 [US6] Add swipe steering to the entrada section of `index.html`: `touchstart` and `touchend` on the
  board, dominant axis, ignore moves under 24 px, then call `pedirDirecao`
- [ ] T046 [US6] Add `touch-action: none` on the board and scroll/zoom prevention to `index.html` so swiping
  never scrolls or zooms the page (FR-016)
- [ ] T047 [US6] Add on-screen direction buttons to `index.html` using `pointerdown`, shown on touch devices
  and hidden when no touch is available, laid out so they never cover the board
- [ ] T048 [US6] Make the question and result screens usable by touch in `index.html`: each alternative and the
  "Continuar" button is a large tap target, the statement fits without scrolling on a phone
- [ ] T049 [US6] Verify and fix the layout in `index.html` for portrait and landscape: whole game visible, no
  horizontal scroll, square cells, HUD readable; check rotation redraws the board

**Checkpoint**: A whole match, including a question round, plays without a keyboard.

---

## Phase 8: User Story 4 - Review mistakes and enter the ranking (Priority: P3)

**Goal**: A game-over review of mistakes and a local top-10 with three-letter initials.

**Independent Test**: Quickstart scenario E.

### Self-test for User Story 4

- [ ] T050 [US4] Add self-test checks in `index.html` for: `qualifica` (score greater than 0 and either fewer
  than 10 entries or greater than the lowest), insertion order (points descending, then older first), the
  10-entry cut, validation on load (initials "Exactly 3 letters A-Z", points "Integer greater than 0",
  timestamp integer; bad entries dropped, bad JSON gives an empty list)

### Implementation for User Story 4

- [ ] T051 [US4] Add the four storage functions to the armazenamento section of `index.html`:
  `carregarRanking()`, `salvarRanking(lista)`, `carregarMudo()`, `salvarMudo(valor)` using keys
  `snake.ranking` and `snake.mudo`, every access in try/catch, exactly as in
  contracts/armazenamento.md, plus a start-up write test that sets `armazenamentoOk`
- [ ] T052 [US4] Add the review to the game-over screen of `index.html` under the heading "Revisão das
  perguntas": each `ERRADA` or `TEMPO` record with its statement, the correct answer, and the explanation;
  "Você acertou todas as perguntas!" when none were missed; "Nenhuma pergunta respondida nesta partida." when
  no question was asked
- [ ] T053 [US4] Add ranking rules to the lógica pura section of `index.html`: `qualifica(pontos, lista)` and
  `inserirNoRanking(lista, entrada)` (sort by points descending then timestamp ascending, cut to 10)
- [ ] T054 [US4] Add the initials prompt to `index.html` in state `INICIAIS`: "Novo recorde!" and "Digite
  suas iniciais", exactly three letters A to Z converted to upper case, confirm enabled only with three
  letters, "Pular" to skip; save with `salvarRanking` and then show the ranking with the new entry
  highlighted
- [ ] T055 [US4] Add the ranking screen to `index.html` in state `RANKING`: reachable from the title screen
  with "Ranking", top 10 highest first, "Nenhum recorde ainda." when empty, a way back to the title
- [ ] T056 [US4] Add the storage failure path to `index.html`: when `armazenamentoOk` is false or
  `salvarRanking` returns false, show "Ranking indisponível neste navegador." instead of the initials prompt,
  and never crash

**Checkpoint**: A saved score survives a page reload; a blocked storage does not break the game.

---

## Phase 9: User Story 5 - Sound, music, and mute (Priority: P3)

**Goal**: Synthesized effects and music with a persistent mute.

**Independent Test**: Quickstart scenario F.

- [ ] T057 [US5] Add the audio engine to the áudio section of `index.html`: a lazily created `AudioContext`,
  one master `GainNode`, resumed on the first key press or tap, silent fallback when audio is blocked or
  unsupported; no audio files
- [ ] T058 [US5] Add six distinct oscillator sound effects to `index.html`: eating a fruit, eating the "?"
  fruit, correct answer, wrong answer or timeout, effect start, game over; call them from the matching events
- [ ] T059 [US5] Add the background music loop to `index.html`: a looping melody scheduled with a 100 ms
  look-ahead, started with a match and stopped at game over and on the title screen
- [ ] T060 [US5] Add mute to `index.html`: the M key and an on-screen button labeled "Som: ligado" or "Som:
  desligado" set the master gain to zero or back; read the initial value with `carregarMudo()` and write
  every change with `salvarMudo()`

**Checkpoint**: Sound plays and stays muted after a reload.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, release automation, and the quality gates of Principle XI.

- [ ] T061 [P] Write the full Portuguese `README.md`: what the game is, how to play (keyboard and touch
  controls, question rounds, effects, scoring), how to open it by double-clicking, how to edit
  `perguntas.js` with the format and limits from contracts/perguntas.md, credits for questions, art, and
  music (Principle VIII), the version shown in the game, and how a release is published
- [ ] T062 [P] Create `.github/workflows/release.yml` following contracts/versao-e-release.md: trigger on
  tags `v*.*.*`, `contents: write` only, read `VERSAO` from `index.html`, fail if the tag differs from `v` +
  `VERSAO`, zip `index.html`, `perguntas.js`, and `README.md` as `snake-vX.Y.Z.zip`, and publish with
  `gh release create` and generated notes, using only checkout and the pre-installed `gh` CLI
- [ ] T063 Review every player-visible string in `index.html`, `perguntas.js`, and `README.md` for pt-BR
  spelling, accents, and consistency with the strings quoted in spec.md; confirm all code comments and
  identifiers are Portuguese
- [ ] T064 Review `index.html` for performance: no allocation-heavy work inside the frame loop, a smooth
  frame rate on a phone-sized viewport
- [ ] T065 Open `index.html#teste` and fix any "falhou" line until every check reports "ok"
- [ ] T066 Run every scenario A to J of quickstart.md on a desktop browser and on a phone, and fix defects
  found; record any deviation in the pull request description
- [ ] T067 Verify offline behavior and the failure modes of quickstart.md scenario I (renamed
  `perguntas.js`, blocked storage, blocked audio)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Stories**: All depend on Foundational.
  - US1 is the MVP and has no dependency on other stories.
  - US2 depends on US1 (uses the match, fruit, and scoring).
  - US3 depends on US1 and reads the effect from US2 (the effect line shows "Nenhum" until US2 exists).
  - US7 (pause) depends on US1; its pause during `PERGUNTA` rule needs US2.
  - US6 (phone) depends on US1 and US2 for the question screens; its pause button task is T044 in US7.
  - US4 (ranking and review) depends on US1 and reads question records from US2.
  - US5 (sound) depends on US1; its effect-start and answer sounds need US2.
- **Polish (Phase 10)**: Depends on all stories being complete; T061 and T062 can start earlier.

### Recommended order by priority

US1 → US2 → US3 → US7 → US6 → US4 → US5. Phases are numbered in this order.

### Within Each Story

- Self-test tasks are written first and expected to fail until the implementation exists.
- Pure logic before rendering, and rendering before input wiring.
- Each story's checkpoint must hold before starting the next.

### Parallel Opportunities

- T002 and T003 (different files) can run in parallel.
- The `perguntas.js` stream (T020 to T025) is independent of the `index.html` stream and can proceed in
  parallel with it; inside the stream, run one task at a time because they edit the same file.
- T061 (`README.md`) and T062 (`release.yml`) are different files and can run in parallel with each other
  and with late `index.html` work.
- Tasks inside `index.html` are sequential.

---

## Parallel Example: Question Content and Game Code

```text
Stream A (index.html): T027 → T028 → T029 → T030 → T031 → T032 → T033 → T034 → T035 → T036
Stream B (perguntas.js): T020 → T021 → T022 → T023 → T024 → T025
Join: T035 needs at least the shipped questions from Stream B to run a real question round.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. **Stop and validate**: run quickstart scenario A and the `#teste` checks.
4. Demo the classic game.

### Incremental Delivery

1. MVP (US1), then US2 for the educational core, then US3 for feedback.
2. Add US7 and US6 so both device classes are playable (the constitution requires this before merge).
3. Add US4 for the review and ranking, then US5 for sound.
4. Finish with Phase 10: README, release workflow, and the quality gates.

### Quality Gates before merge (Principle XI)

- The game starts and is playable start to finish on desktop and phone (T066).
- Sound and the mute control work (T058 to T060, scenario F).
- The plan's Constitution Check still passes.
- The README is updated (T061).
- A second member reviews the Pull Request.

---

## Notes

- [P] tasks touch different files and have no unfinished dependency.
- [Story] labels map every task to a user story in spec.md for traceability.
- Commit after each task or logical group, on branch `001-snake-game`.
- Stop at any checkpoint to validate the story on its own.
- Do not add frameworks, build steps, external fonts, or audio files: the constitution forbids them.
