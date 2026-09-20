# Feature Specification: Snake — Educational Arcade Game

**Feature Branch**: `001-snake-game`

**Created**: 2026-09-20

**Status**: Draft

**Input**: User description: "Build "Snake", an educational arcade game in the style of the classic Snake. The player steers a snake around a grid, eats fruit to grow and score, and loses by hitting a wall or its own body. Every few fruits a special "?" fruit appears. Eating it pauses the game and asks a timed multiple-choice question with four alternatives. A correct answer grants a temporary upgrade from a fixed repeating cycle (slow motion, pass through own body, double points, one-hit shield). A wrong answer or timeout reveals the correct answer with a short explanation, resets the combo and applies a temporary downgrade (the snake speeds up); it never ends the game by itself. The screen shows score, combo, the active upgrade or downgrade, snake length and the game version. At game over, show a summary that reviews the missed questions with their explanations, and save the score in a local top-10 ranking with three-letter initials. The game has sound effects and music with a mute control. All on-screen text is in Brazilian Portuguese; quote it in Portuguese in the spec. It works on desktop (keyboard) and mobile (swipe and on-screen buttons)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a classic Snake match (Priority: P1)

A player opens the game, starts a match with "Jogar", and steers the snake around a fixed grid enclosed by
solid walls. Eating a fruit grows the snake and adds points. The match ends the moment the snake's head hits a
wall or its own body. The player has one life.

**Why this priority**: This is the arcade core. With only this story the game is already playable and
satisfies the arcade identity, so it is the minimum viable product.

**Independent Test**: Start a match with the question round switched off in a test build or by not eating any
"?" fruit, eat several fruits, and crash into a wall and into the snake's own body. Delivers a complete
start-to-finish arcade session.

**Acceptance Scenarios**:

1. **Given** the title screen, **When** the player chooses "Jogar", **Then** a match starts with a snake of
   length 3 moving to the right and one regular fruit on the grid.
2. **Given** a running match, **When** the snake's head enters the cell of a regular fruit, **Then** the snake
   grows by one segment, the score increases, and a new fruit appears on a free cell.
3. **Given** a running match, **When** the head moves into a wall or into a body segment, **Then** the match
   ends and "Fim de jogo" is shown.
4. **Given** a snake moving to the right, **When** the player presses the opposite direction (left), **Then**
   the input is ignored and the snake keeps moving to the right.
5. **Given** a snake moving to the right, **When** the player presses up and then left within the same tick,
   **Then** the snake turns up only, and does not reverse into itself.
6. **Given** the snake grows, **When** it reaches successive fruit counts, **Then** it speeds up gradually until
   it reaches the normal speed cap and never exceeds the absolute maximum speed.

---

### User Story 2 - Answer a question round (Priority: P2)

Every 5 regular fruits, a special "?" fruit appears. When the snake eats it, the game pauses and shows one
question with four alternatives and a 15-second countdown. The player answers with keys 1 to 4 or by tapping an
alternative. A correct answer grants a temporary upgrade from a fixed repeating cycle. A wrong answer or a
timeout shows the correct answer with a short explanation, resets the combo, and applies a temporary downgrade
(the snake speeds up). A wrong answer never ends the match.

**Why this priority**: This is what makes the game educational and different from plain Snake. It depends on
User Story 1 and is the main learning moment.

**Independent Test**: Play until the first "?" fruit, answer correctly once, then wrong once and let one
question time out. Confirm the upgrade cycle order, the downgrade, the feedback text, and that the match
continues after each.

**Acceptance Scenarios**:

1. **Given** the player has eaten 5 regular fruits since the last "?" fruit (or since the start), **When** the
   fifth fruit is eaten, **Then** a "?" fruit appears on a free cell, and only one "?" fruit exists at a time.
2. **Given** the "?" fruit is on the grid, **When** the head enters its cell, **Then** the snake stops moving,
   the question screen opens with the statement, four shuffled alternatives, and a countdown from 15 seconds.
3. **Given** the question is shown, **When** the player presses 1, 2, 3, or 4, or taps an alternative,
   **Then** that alternative is submitted.
4. **Given** a correct answer, **When** it is submitted, **Then** the screen shows "Resposta correta!" with the
   explanation, 50 bonus points are awarded, and after the player continues, the next upgrade in the cycle is
   active.
5. **Given** upgrades were granted before, **When** correct answers are given in sequence, **Then** upgrades
   follow this fixed order, repeating forever: "Câmera lenta", "Atravessar o corpo", "Pontos em dobro",
   "Escudo".
6. **Given** a wrong answer, **When** it is submitted, **Then** the screen shows "Resposta errada!", the correct
   alternative highlighted, and its explanation; the combo resets; and after the player continues, a
   downgrade named "Turbo" is active.
7. **Given** the 15-second countdown reaches zero, **When** no answer was submitted, **Then** the game behaves
   as for a wrong answer, and the screen shows "Tempo esgotado!" instead of "Resposta errada!".
8. **Given** the result screen is shown, **When** the player presses Enter or Space, or taps "Continuar", after
   the first 0.6 seconds, **Then** the game resumes and the snake moves again only after a short 3-2-1 resume
   countdown. Answer keys 1 to 4 do not continue, and any input in the first 0.6 seconds is ignored, so a
   double press on an answer cannot skip the explanation.
9. **Given** a question round happens, **When** it ends in any way, **Then** the match is still running and no
   game over occurs because of the answer.
10. **Given** the question bank has enough questions, **When** questions are drawn during one match, **Then** no
    question repeats until every question in the bank has been used, and subjects are drawn in a balanced way.

---

### User Story 3 - See the game state on screen (Priority: P2)

While playing, the player always sees the score, the combo, the active upgrade or downgrade with its remaining
time, the snake's length, and the game version.

**Why this priority**: The player needs immediate feedback to enjoy the arcade loop and to understand the
effect of each answer.

**Independent Test**: Play a match through the first question round and confirm every element updates when
the state changes.

**Acceptance Scenarios**:

1. **Given** a running match, **When** the player looks at the screen, **Then** the labels "Pontos", "Combo",
   "Tamanho", and "Efeito", plus the version (for example "v1.0.0"), are visible together with the play area.
2. **Given** no effect is active, **When** the player looks at "Efeito", **Then** it shows "Nenhum".
3. **Given** an upgrade or downgrade is active, **When** the player looks at "Efeito", **Then** it shows its
   name and the remaining time (or "1 uso" for the shield), updating while it counts down.
4. **Given** the player eats a fruit, **When** the score and length change, **Then** the displayed values update
   within the same tick.

---

### User Story 4 - Review mistakes and enter the ranking (Priority: P3)

When the match ends, the player sees a summary with the final score, the snake's length, and a review of every
question answered wrongly or timed out, each with the correct answer and its explanation. If the score
qualifies for the local top-10, the player enters three letters of initials and the score is saved. The ranking
can be viewed from the title screen.

**Why this priority**: It closes the learning loop and adds replay value, but the game is playable without it.

**Independent Test**: Finish one match with at least one missed question and one with none, and check the
summary; then finish a match with a qualifying score and confirm the entry appears in the ranking after a page
reload.

**Acceptance Scenarios**:

1. **Given** the match ended after some missed questions, **When** "Fim de jogo" is shown, **Then** the summary
   lists each missed question with the correct answer and the explanation, under the heading "Revisão das
   perguntas".
2. **Given** the match ended and the player missed no questions, **When** the summary is shown, **Then** it shows
   "Você acertou todas as perguntas!".
3. **Given** the match ended and no question round happened, **When** the summary is shown, **Then** it shows
   "Nenhuma pergunta respondida nesta partida.".
4. **Given** the final score is above zero and either the ranking has fewer than 10 entries or the score is
   higher than the 10th entry, **When** the summary is shown, **Then** the game shows "Novo recorde!" and asks
   for three letters ("Digite suas iniciais").
5. **Given** the initials prompt, **When** the player enters three letters A to Z and confirms, **Then** the
   score is saved and the ranking is shown with the new entry highlighted.
6. **Given** two entries with the same score, **When** the ranking is shown, **Then** the older entry ranks
   above the newer one.
7. **Given** the score does not qualify, **When** the summary is shown, **Then** no initials prompt appears.
8. **Given** the title screen, **When** the player chooses "Ranking", **Then** the top 10 is shown, or "Nenhum
   recorde ainda." if it is empty.
9. **Given** the browser's storage is unavailable, **When** the match ends, **Then** the game still shows the
   summary, does not crash, and shows "Ranking indisponível neste navegador.".

---

### User Story 5 - Sound, music, and mute (Priority: P3)

The game plays sound effects (eating a fruit, eating the "?" fruit, a correct answer, a wrong answer, an
upgrade or downgrade starting, and game over) and background music. The player can mute everything with the
M key or an on-screen button, and the choice is remembered on the next visit.

**Why this priority**: Required by the arcade identity, but it does not block the gameplay stories.

**Independent Test**: Play with sound on, mute with the key, reload the page, and confirm it is still muted.

**Acceptance Scenarios**:

1. **Given** sound is on, **When** each event in the list above happens, **Then** a distinct sound effect plays.
2. **Given** a match is running, **When** the player presses M or taps the sound button, **Then** all sound and
   music stop, and the button shows "Som: desligado".
3. **Given** the game was muted, **When** the player reloads the page, **Then** it stays muted, and the button
   shows "Som: desligado".
4. **Given** the browser blocks audio until the first interaction, **When** the player starts a match,
   **Then** sound starts working without an error.

---

### User Story 6 - Play on a phone (Priority: P2)

On a phone, the player steers by swiping on the play area or by tapping on-screen direction buttons, pauses
with an on-screen button, and answers questions by tapping an alternative. The layout fits the screen in
portrait and landscape.

**Why this priority**: Mobile is a declared supported device, so under the constitution the game is not
mergeable until it works there.

**Independent Test**: Open the game on a phone-sized screen and play through a match, including a question
round, without a keyboard.

**Acceptance Scenarios**:

1. **Given** a touch device, **When** the player swipes up, down, left, or right on the play area, **Then**
   the snake turns in that direction, subject to the no-reverse rule.
2. **Given** a touch device, **When** the player taps an on-screen arrow button, **Then** the snake turns in
   that direction.
3. **Given** a phone, **When** the match is running, **Then** an on-screen pause button is visible and works.
4. **Given** a phone, **When** the device is rotated, **Then** the whole game remains visible without
   horizontal scrolling, and the play area keeps square cells.
5. **Given** a phone, **When** the question is shown, **Then** each alternative is a tap target large enough
   to be tapped without error and the statement fits without scrolling.
6. **Given** a phone, **When** the player swipes on the play area, **Then** the page does not scroll or zoom.

---

### User Story 7 - Pause and resume (Priority: P3)

The player can pause a running match with P or Esc (or the on-screen pause button) and resume the same way.

**Why this priority**: Comfort feature that completes the controls.

**Independent Test**: Pause mid-match, wait, resume, and confirm nothing moved or expired meanwhile.

**Acceptance Scenarios**:

1. **Given** a running match, **When** the player presses P or Esc, **Then** the game freezes and shows
   "Pausado".
2. **Given** the game is paused, **When** the player presses P or Esc again, or taps "Continuar", **Then** it
   resumes after a short 3-2-1 countdown.
3. **Given** the game is paused, **When** time passes, **Then** the snake, the effect timers, and the
   question timer (if any) do not advance.
4. **Given** the browser tab loses focus or becomes hidden during a match, **When** that happens, **Then** the
   game pauses automatically.
5. **Given** the question screen is open, **When** the player presses P or Esc, **Then** nothing happens: a
   question cannot be skipped by pausing.

---

### Edge Cases

- **Question bank missing or empty**: the title screen shows a clear warning ("Perguntas não encontradas.
  Verifique o arquivo perguntas.js.") and "Jogar" is disabled; the game must not crash.
- **Question bank smaller than a match needs**: when every question has been used in the match, the drawing
  restarts from the full bank with the same balanced-subject rule.
- **Malformed question entry** (missing statement, fewer than four alternatives, or no explanation): the game
  skips it and continues with the valid ones; if none are valid, it behaves as an empty bank.
- **Fewer than four alternatives is never shown**: a question is only used if it has at least four
  alternatives, and exactly four are shown (the correct one plus three others, chosen randomly and shuffled).
- **Too-long text**: alternatives longer than 40 characters and statements longer than 160 characters are
  flagged as invalid and skipped.
- **Grid full**: if no free cell exists for a new fruit, the match ends as a win with "Você venceu!" and the
  normal summary and ranking flow.
- **Fruit spawn location**: fruits never appear on the snake or on another fruit.
- **Pass-through upgrade ends inside the body**: if the "Atravessar o corpo" time runs out while the head is on
  a body segment, the effect stays active (with "0s") until the head leaves the body, so it never kills the
  player unfairly at expiry.
- **Shield used on a wall**: the shield cancels the collision, the snake does not move that tick, and the
  player can steer away on the next tick; the shield is then consumed.
- **Shield never used**: it expires after 30 seconds of play time.
- **Effects replace each other**: only one upgrade or downgrade is active at a time; a new one replaces the
  current one, including an unused shield.
- **Downgrade at the speed limit**: the downgraded speed is capped at the absolute maximum, so the downgrade
  may add little or no speed late in the match, but it is still announced and counted.
- **"?" fruit while an effect is active**: allowed; the question round works the same.
- **Simultaneous events**: if the head enters the "?" fruit cell and a collision would happen on the same
  move, the collision wins and the match ends.
- **Rapid key presses**: at most one direction change is applied per tick; extra presses in the same tick are
  queued (up to 2) and applied on following ticks, still respecting the no-reverse rule.
- **Ranking is full**: a qualifying score replaces the 10th entry, which is dropped.
- **Initials**: only letters A to Z are accepted, converted to upper case; confirming with fewer than three
  letters is not possible; the player can skip saving with "Pular".
- **Sound cannot start** (blocked audio): the game continues silently and retries on the next interaction.
- **Very small screens**: below the smallest supported size, the game shows "Gire o aparelho ou aumente a
  janela." instead of an unplayable layout.

## Requirements *(mandatory)*

### Functional Requirements

**Core gameplay**

- **FR-001**: The game MUST provide a play area of 20 columns by 20 rows, enclosed by solid walls.
- **FR-002**: A new match MUST start with a snake of length 3, moving to the right, one regular fruit on the
  grid, score 0, combo x1, and no active effect.
- **FR-003**: The snake MUST move one cell per tick in its current direction.
- **FR-004**: The player MUST have exactly one life; the match MUST end when the head hits a wall or a body
  segment, except where an active "Atravessar o corpo" or "Escudo" effect applies.
- **FR-005**: Eating a regular fruit MUST grow the snake by one segment and place a new regular fruit on a
  random free cell.
- **FR-006**: The game MUST ignore a direction input that is the opposite of the current direction, and MUST
  apply at most one direction change per tick.
- **FR-007**: If the snake fills the entire grid, the match MUST end with "Você venceu!".

**Difficulty and speed**

- **FR-008**: The game MUST have a single difficulty, with no selection option.
- **FR-009**: The base speed MUST start at 6 moves per second and increase by 0.15 moves per second for each
  regular fruit eaten, up to a normal cap of 12 moves per second (reached after 40 fruits).
- **FR-010**: The game speed MUST NEVER exceed the absolute maximum of 16 moves per second, including while
  a downgrade is active.

**Controls**

- **FR-011**: On desktop, the player MUST be able to steer with the arrow keys and with W, A, S, D.
- **FR-012**: On phones, the player MUST be able to steer by swiping on the play area (minimum swipe distance
  of 24 pixels) and by on-screen direction buttons.
- **FR-013**: P or Esc MUST pause and resume a match; phones MUST also offer an on-screen pause button. The
  same "Pausar" button is also shown on desktop.
- **FR-014**: The game MUST pause automatically when the page loses focus or becomes hidden during a match,
  and MUST resume only through the pause screen.
- **FR-015**: Resuming from pause and from a question result MUST be followed by a 3-2-1 countdown before the
  snake moves again. The same countdown is also shown before the first move of a new match.
- **FR-016**: On touch devices, swiping on the play area MUST NOT scroll or zoom the page.

**Question round**

- **FR-017**: After every 5th regular fruit eaten, a special "?" fruit MUST appear on a random free cell; only
  one "?" fruit MUST exist at a time, and it MUST stay on the grid until eaten.
- **FR-018**: Eating the "?" fruit MUST stop the snake and all timers and show one question with the
  statement, four alternatives in random order, and a visible 15-second countdown. The "?" fruit MUST NOT
  grow the snake and MUST NOT award fruit points.
- **FR-019**: The player MUST be able to answer with keys 1 to 4 or by tapping an alternative; other keys,
  including P and Esc, MUST NOT skip the question.
- **FR-020**: A correct answer MUST award 50 bonus points, count as one consecutive fruit for the combo, and
  grant the next upgrade of the fixed cycle: "Câmera lenta", "Atravessar o corpo", "Pontos em dobro",
  "Escudo", then again from the first. The cycle position MUST persist for the whole match and MUST restart
  in each new match.
- **FR-021**: A wrong answer or a timeout MUST show the correct answer with its explanation, reset the combo
  to x1, and apply the downgrade "Turbo".
- **FR-022**: A wrong answer or a timeout MUST NOT end the match by itself.
- **FR-023**: After any result, the game MUST show the outcome message ("Resposta correta!", "Resposta
  errada!", or "Tempo esgotado!"), the correct answer, and the explanation, and MUST wait for the player to
  continue before resuming play.
- **FR-024**: Every question asked, with the result, MUST be recorded during the match for the end-of-match
  review.

**Upgrades and downgrade**

- **FR-025**: "Câmera lenta" MUST reduce the current speed to half for 8 seconds.
- **FR-026**: "Atravessar o corpo" MUST let the head pass through the snake's own body for 8 seconds; walls
  remain fatal.
- **FR-027**: "Pontos em dobro" MUST double all points earned (fruit points and answer bonus) for 10 seconds.
- **FR-028**: "Escudo" MUST cancel the next single collision (wall or body); it lasts until used or for
  30 seconds, whichever comes first.
- **FR-029**: "Turbo" MUST multiply the current speed by 1.4 for 8 seconds, capped by FR-010.
- **FR-030**: Only one effect MUST be active at a time; a new effect MUST replace the current one.
- **FR-031**: Effect durations MUST count only play time: they MUST NOT advance during pause, during a
  question, or during a resume countdown.

**Scoring**

- **FR-032**: A regular fruit MUST award 10 points multiplied by the current combo multiplier.
- **FR-033**: The combo multiplier MUST be 1 + the number of consecutive fruits divided by 5, rounded down,
  capped at x5. Consecutive fruits are regular fruits and correct answers eaten since the last wrong answer,
  timeout, or match start.
- **FR-034**: The answer bonus (50 points) MUST NOT be multiplied by the combo.
- **FR-035**: The score MUST be a whole number and MUST NOT decrease during a match.

**On-screen information**

- **FR-036**: During play, the game MUST always show the score ("Pontos"), the combo ("Combo"), the snake's
  length ("Tamanho"), the active effect with its remaining time or "1 uso" ("Efeito"), and the game version.
- **FR-037**: The game MUST show the version in the semantic format "vMAJOR.MINOR.PATCH" (initial release
  "v1.0.0").
- **FR-038**: Each effect start MUST be announced on screen with its name, and effect type (upgrade or
  downgrade) MUST be visually distinct.

**End of match and ranking**

- **FR-039**: At game over, the game MUST show "Fim de jogo", the final score, the snake's length, and the
  review of missed questions, each with the statement, the correct answer, and the explanation, under
  "Revisão das perguntas".
- **FR-040**: If no question was missed, the summary MUST show "Você acertou todas as perguntas!"; if no
  question was asked, it MUST show "Nenhuma pergunta respondida nesta partida.".
- **FR-041**: The game MUST keep a top-10 ranking of score and three-letter initials in browser storage on
  the player's own device, with no server, account, or network.
- **FR-042**: A score MUST qualify for the ranking only if it is greater than zero and either the ranking has
  fewer than 10 entries or the score is greater than the lowest entry.
- **FR-043**: A qualifying score MUST trigger "Novo recorde!" and a prompt "Digite suas iniciais" accepting
  exactly three letters A to Z; the player MUST be able to skip with "Pular".
- **FR-044**: The ranking MUST be viewable from the title screen ("Ranking"), sorted from highest to lowest,
  with older entries first among equal scores.
- **FR-045**: If browser storage is unavailable, the game MUST keep working and show "Ranking indisponível
  neste navegador.".
- **FR-046**: The player MUST be able to start a new match from the summary with "Jogar de novo" and go back
  to the title screen with "Menu".

**Sound**

- **FR-047**: The game MUST play distinct sound effects for: eating a fruit, eating the "?" fruit, a correct
  answer, a wrong answer or timeout, an effect starting, and game over.
- **FR-048**: The game MUST play background music during matches.
- **FR-049**: The player MUST be able to mute and unmute all sound with the M key and with an on-screen
  button labeled "Som: ligado" or "Som: desligado"; the choice MUST be remembered between visits.
- **FR-050**: Sound MUST be generated by the game in real time; no audio files may be required.

**Question bank and content**

- **FR-051**: Questions MUST be read from a separate file, `perguntas.js`, in the shared format `{ q, a, e, m }`
  defined by the constitution, so an educator can edit them without changing game code.
- **FR-052**: The game MUST draw questions balanced by subject (`m`) and MUST NOT repeat a question in a match
  until all valid questions have been used.
- **FR-053**: If `perguntas.js` is missing, empty, or has no valid question, the game MUST show "Perguntas não
  encontradas. Verifique o arquivo perguntas.js." and MUST disable "Jogar".
- **FR-054**: The game MUST ship with at least 60 original questions covering at least 5 subjects of general
  knowledge and high-school content for Ifes students, each with a short explanation.
- **FR-055**: Alternatives MUST NOT exceed 40 characters and statements MUST NOT exceed 160 characters.
- **FR-056**: Questions, art, and music MUST be original or properly licensed; credits MUST appear in the
  game's README.

**Platform and language**

- **FR-057**: All text the player sees MUST be in Brazilian Portuguese (pt-BR).
- **FR-058**: The game MUST be playable start-to-finish in current desktop and mobile browsers, work offline,
  and open without installation or server.
- **FR-059**: The layout MUST adapt to the screen size and orientation, keep square cells, and show the whole
  game without horizontal scrolling on phones.
- **FR-060**: The game MUST reproduce a golden-age arcade look: cabinet-style presentation, short sessions,
  and immediate feedback for every action.

### Key Entities

- **Match**: One play session from "Jogar" to game over. Holds score, combo, snake, fruits, active effect,
  upgrade-cycle position, and the list of asked questions.
- **Snake**: An ordered list of cells (head first) with a current direction and a pending direction queue.
- **Fruit**: A regular fruit (grows the snake, awards points) or the special "?" fruit (opens a question).
- **Effect**: The single active upgrade or downgrade, with a name, a type (upgrade or downgrade), and a
  remaining time or remaining uses.
- **Upgrade Cycle**: The fixed order "Câmera lenta", "Atravessar o corpo", "Pontos em dobro", "Escudo",
  repeated for the match.
- **Question**: A statement, four alternatives (one correct), an explanation, and a subject.
- **Question Record**: A question asked in a match with the player's result (correct, wrong, or timeout), used
  by the end-of-match review.
- **Ranking Entry**: A three-letter initials string and a score, stored on the player's device; at most 10.
- **Sound Preference**: Whether sound is on or off, remembered between visits.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time player can start a match and steer the snake within 10 seconds of opening the game,
  with no instructions needed beyond the title screen.
- **SC-002**: A complete match, including at least one question round, can be played start-to-finish on both a
  desktop browser (keyboard) and a phone (touch only) with no unreachable screen or control.
- **SC-003**: In 100% of the test runs, a wrong answer or a timeout never ends the match and always shows the
  correct answer with its explanation before play resumes.
- **SC-004**: In 100% of the test runs, the upgrades appear in the exact fixed order across at least 8
  consecutive correct answers.
- **SC-005**: The snake's speed never exceeds 16 moves per second in any state, verified across a full match
  with all effects applied.
- **SC-006**: Every direction input is applied within one tick of being pressed (at most 170 ms at the slowest
  base speed), and no input can make the snake reverse into itself.
- **SC-007**: After a match with at least one missed question, 100% of the missed questions appear in the
  summary with their correct answers and explanations.
- **SC-008**: A ranking entry saved in one session is still shown after closing and reopening the browser on
  the same device.
- **SC-009**: The game remains playable and shows no error message when the question file is broken, when
  browser storage is unavailable, and when audio is blocked.
- **SC-010**: At least 90% of students in a classroom trial report that they understood why an answer was
  right or wrong after seeing the explanation.
- **SC-011**: The game opens and runs with the network turned off.
- **SC-012**: All text visible to the player is in Brazilian Portuguese, with no untranslated text found in a
  full walkthrough of every screen.

## Assumptions

- Numeric values in this spec (grid size, speed curve, timers, scores, effect durations) are reasoned defaults
  chosen to meet the constitution rule that Part II values be concrete; they can be tuned later without
  changing the rules.
- Speeds are measured in moves per second; the 16 moves-per-second absolute maximum is the single limit
  required by the constitution.
- The player is a high-school student at Ifes, playing in short sessions on a school computer or a personal
  phone.
- "Every few fruits" is interpreted as every 5 regular fruits.
- The "?" fruit counts toward neither the combo nor the regular-fruit counter until answered correctly; a
  correct answer counts as one consecutive fruit for the combo only.
- The question-round upgrade cycle is global for the match, not per subject, and always restarts at "Câmera
  lenta" in a new match.
- Music is a short looping arcade-style melody generated by the game; the composition and sound design are
  left to the plan.
- The initial release version is "v1.0.0"; the release process is defined by the constitution.
- The ranking is per browser on each device; there is no sharing between devices.
- Question content is written for this project; sources and credits go in the README, per the constitution.
- Portrait and landscape are both supported on phones; very small windows show a message instead of the game.
