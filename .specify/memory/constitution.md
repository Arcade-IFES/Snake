<!--
Sync Impact Report
Version change: 2.1.0 -> 3.0.0 (MAJOR: rule S-VII redefined; the subject area changed from general knowledge
  and high-school content to databases only)
Modified principles: S-VII "Subject Area and Audience" (same title; new subject rules and a rationale)
Added sections: none
Removed sections: none
Deferred TODOs: none. Part I is unchanged. Dependent documents that still describe the old subject area
  (spec.md FR-054, spec.md assumptions, tasks T020 to T025) are outside this command and are listed as
  Next Actions.
-->

# Arcade-IFES Games Constitution

## Part I — Arcade-IFES Common Rules

These rules apply to every game created from the central repository. They are owned by the central
repository and MUST NOT be edited inside a game repository. A game adds its own rules only in Part II.

### I. Language
Spec Kit artifacts (this constitution, specs, plans, tasks, checklists, and the central documentation)
MUST be written in English. Everything the player sees or an educator edits (menus, messages, questions,
explanations, and the game's own README) MUST be written in Brazilian Portuguese (pt-BR). Game source
code and comments follow the game and MUST be in Portuguese. When an English spec refers to on-screen
text, it MUST quote that text in Portuguese.

Rationale: the course requires English Spec Kit documentation, while the games serve Portuguese-speaking
students and teachers.

### II. Technology Stack
Every game MUST use plain HTML, CSS, and vanilla JavaScript only. Frameworks, bundlers, package
dependencies, and servers MUST NOT be required. The game MUST open by double-clicking its HTML file from a
folder and MUST work offline. External web fonts MAY be used only with a system-font fallback.

Rationale: a zero-install game is easy to run in a classroom and easy for a teacher to maintain.

### III. Arcade Identity
Every game MUST reproduce the look and feel of golden-age arcades: cabinet-style presentation, short
sessions, immediate feedback, and a score that rewards skill. Difficulty, controls, and supported devices
are deliberately NOT fixed by this constitution: each game MUST define them in its own spec and in Part II.

### IV. Sound
Every game MUST have sound effects and music. It MUST provide a mute control, both as a keyboard shortcut and
as an on-screen button, and MUST remember the player's choice in the browser. Sound MUST be generated in
real time with the Web Audio API, and the game MUST NOT require audio files.

### V. Ranking
Every game MUST keep a top-10 ranking with three-letter initials, stored in the browser (`localStorage`).
Each machine keeps its own ranking. The game MUST NOT depend on servers, accounts, or network calls for the
ranking, and MUST keep working when browser storage is unavailable.

### VI. Question Bank Contract
Questions MUST live in a separate file named `perguntas.js`, so an educator can edit them without touching
game code. The file MUST declare `const PERGUNTAS = [{ q, a, e, m }, ...]` where `q` is the statement, `a` is
the list of alternatives with the first one always correct (the game shuffles them), `e` is a short
explanation shown after the player answers, and `m` is the subject used for balanced drawing. If the file is
missing or empty, the game MUST show a clear warning and disable the start button instead of crashing.
Additional limits, such as the maximum length of an alternative, belong to the individual game.

### VII. Educational Purpose
Every game MUST teach something. A wrong answer MUST NOT punish harshly, and the correct answer with its
explanation MUST always be shown. The end-of-match summary MUST review the player's mistakes. Learning content
MUST NOT take over the arcade loop.

### VIII. Content Originality
Questions, art, and music MUST be original or properly licensed. Copying from exams (such as ENEM and
vestibulares), textbooks, or other games is prohibited. Credits MUST appear in the game's README.

### IX. Versioning and Releases
Every game MUST use semantic versioning (`MAJOR.MINOR.PATCH`), published on GitHub as tags (`vX.Y.Z`) and
Releases, and MUST show its current version in the game. How the game automates this is left to the game.

### X. Spec-Driven Workflow
No code MUST be written for a feature without an approved spec, plan, and tasks. Each feature MUST have its own
branch and Pull Request, and `specs/NNN-.../` MUST be committed together with the code. Specs MUST stay
technology-agnostic, because the stack is already fixed by Principle II.

### XI. Quality Gates
A feature MUST NOT be merged unless: the game starts and is playable start-to-finish on the devices its own
spec declares; sound and the mute control work; the plan's Constitution Check passes; the game's README is
updated; and a second member has reviewed the Pull Request.

## Governance

Part I changes only through a Pull Request to the central repository, with a semantic version bump and an
announcement to the group. MAJOR removes or redefines a rule, MINOR adds a rule, and PATCH is wording only.
Game repositories MUST sync Part I deliberately; they MUST NOT edit it locally. Part II belongs to each game.
Specs, plans, tasks, and Pull Requests MUST identify any conflict with this constitution, and a deviation
requires a written rationale and reviewer approval.

## Part II — Game-Specific Rules

These rules apply only to Snake. They add to Part I and MUST NOT contradict it.

### S-I. Core Gameplay
The game MUST be classic Snake on a fixed-size grid enclosed by solid walls. The player has exactly one life.
The game MUST end when the snake's head hits a wall or the snake's own body. Eating a regular fruit MUST grow
the snake by one segment.

### S-II. Difficulty Model
The game MUST have a single difficulty, with no difficulty selection. The snake MUST speed up gradually as it
grows, up to a maximum speed that the game MUST NOT exceed, so the game stays playable. The spec MUST define
the speed curve and the maximum speed as concrete values.

Rationale: one difficulty keeps sessions short and the ranking comparable across players.

### S-III. Controls
On desktop, the snake MUST be steered with the arrow keys and with W, A, S, and D. On phones, it MUST be
steered by swiping on the play area and by on-screen direction buttons. P or Esc MUST pause and resume the
game, and phones MUST also offer an on-screen pause control. The snake MUST NOT be able to reverse directly
into itself within a single tick, even when the player presses two directions quickly.

### S-IV. Supported Devices
The game MUST be playable start-to-finish in current desktop and mobile browsers. The layout MUST adapt to the
screen size and orientation, and phone controls MUST be usable without a keyboard. Under Principle XI, both
device classes MUST be verified before a feature is merged.

### S-V. Question Round
A special "?" fruit MUST appear periodically. Eating it MUST pause the game and show one question with four
alternatives, a visible countdown timer, and answering by keys 1 to 4 or by tap. The question MUST come from
`perguntas.js` and MUST use balanced drawing by subject (`m`), as defined by Principle VI.

- Correct answer: the game MUST apply a temporary upgrade taken from a fixed, repeating cycle of upgrades,
  in the same order every time. Each upgrade MUST be announced on screen and MUST expire on its own.
- Wrong answer or timeout: the game MUST show the correct answer with its explanation, reset the combo, and
  apply a temporary downgrade that speeds the snake up. The downgrade MUST expire on its own and MUST still
  respect the maximum speed from S-II.
- A wrong answer or a timeout MUST NOT end the game by itself. Only S-I ends the game.
- The snake MUST NOT advance during the question round, and play MUST resume only after the player has seen
  the result.

Rationale: the round keeps the learning content inside the arcade loop (Principles III and VII) and turns a
mistake into a manageable penalty instead of a punishment.

### S-VI. Scoring
Each regular fruit MUST award points multiplied by a combo multiplier. The multiplier MUST grow with each
consecutive fruit and MUST reset to its base value on a wrong answer or a timeout. Each correct answer MUST
award bonus points on top of the fruit points. The spec MUST define the base points, the multiplier growth and
its cap, and the bonus value. The current score and combo MUST be visible during play, and the final score
MUST feed the ranking required by Principle V.

### S-VII. Subject Area and Audience
The question content MUST be about databases only, from beginner to advanced, written for students of Ifes.
Every question MUST belong to a database topic, and the subject `m` of each question MUST name that topic.
The bank MUST cover the whole range: beginner topics (such as fundamentals, data modeling, and basic SQL) and
advanced topics (such as advanced SQL, transactions and indexes, and NoSQL and architecture). The bank MUST
NOT contain questions outside databases. It MUST follow the shared `perguntas.js` format from Principle VI,
MUST fit the four-alternative layout, and MUST keep each alternative short enough to be read on a phone within
the question timer. The end-of-match summary MUST list the questions the player missed, with their
explanations, as required by Principle VII.

Rationale: the game supports the databases course, so every question round reinforces course content.

**Version**: 3.0.0 | **Ratified**: 2026-09-19 | **Last Amended**: 2026-09-20
