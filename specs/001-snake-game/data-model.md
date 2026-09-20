# Data Model: Snake — Educational Arcade Game

Field names are given in English for this document; the game source uses Portuguese identifiers. All data
lives in memory during a match; only the ranking and the sound preference are persisted (see
[contracts/armazenamento.md](contracts/armazenamento.md)).

## Constants

| Name | Value | Spec source |
|------|-------|-------------|
| Columns x rows | 20 x 20 | FR-001 |
| Start length | 3 | FR-002 |
| Base speed start / step / cap | 6 / +0.15 per fruit / 12 moves per second | FR-009 |
| Absolute maximum speed | 16 moves per second | FR-010 |
| Fruits per question round | 5 | FR-017 |
| Question time | 15 s | FR-018 |
| Fruit points | 10 | FR-032 |
| Answer bonus | 50 | FR-020, FR-034 |
| Combo step / cap | +1 per 5 consecutive fruits / x5 | FR-033 |
| Resume countdown | 3 s | FR-015 |
| Effect durations | slow 8 s, pass-through 8 s, double 10 s, shield 30 s or 1 use, turbo 8 s | FR-025 to FR-029 |
| Direction queue size | 2 | Edge cases |
| Swipe threshold | 24 px | FR-012 |
| Max alternative / statement length | 40 / 160 characters | FR-055 |

## Match

| Field | Type | Notes |
|-------|------|-------|
| state | enum | `TITULO`, `JOGANDO`, `PAUSADO`, `CONTAGEM`, `PERGUNTA`, `RESULTADO`, `FIM`, `INICIAIS`, `RANKING` |
| score | integer | Never decreases (FR-035) |
| fruitsEaten | integer | Regular fruits only; drives base speed and the "?" schedule |
| fruitsSinceQuestion | integer | Resets to 0 when the "?" fruit spawns |
| combo | integer | Consecutive fruits since the last wrong answer, timeout, or start |
| snake | Snake | See below |
| fruit | Fruit | The regular fruit |
| special | Fruit or null | The "?" fruit; at most one at a time |
| effect | Effect or null | At most one active |
| cyclePosition | integer 0-3 | Next upgrade in the cycle; restarts each match |
| records | list of Question Record | For the end-of-match review |
| usedQuestions | set | Prevents repeats until the bank is exhausted |
| won | boolean | True when the grid is full (FR-007) |

**Derived values**

- `multiplier = min(1 + floor(combo / 5), 5)`
- `baseSpeed = min(6 + 0.15 * fruitsEaten, 12)`
- `speed = limitarVelocidade(baseSpeed * effectFactor)`, where `limitarVelocidade` clamps to 16
- `length = snake.cells.length`

## Snake

| Field | Type | Notes |
|-------|------|-------|
| cells | list of (x, y) | Head first; all inside the grid |
| direction | enum | `CIMA`, `BAIXO`, `ESQUERDA`, `DIREITA` |
| queue | list of direction, max 2 | Pending turns; one applied per tick; opposite of the last applied direction is dropped |

**Rules**: the head moves one cell per tick; a tail segment is removed unless the snake just ate a regular
fruit (then it grows by one).

## Fruit

| Field | Type | Notes |
|-------|------|-------|
| kind | enum | `COMUM` or `ESPECIAL` (the "?") |
| x, y | integer | A free cell: not on the snake, not on the other fruit |

## Effect

| Field | Type | Notes |
|-------|------|-------|
| name | string | "Câmera lenta", "Atravessar o corpo", "Pontos em dobro", "Escudo", "Turbo" |
| type | enum | `UPGRADE` or `DOWNGRADE` |
| remaining | number | Seconds of play time left; for the shield also `usesLeft` = 1 |
| speedFactor | number | 0.5 for slow, 1.4 for turbo, 1 otherwise |

**Upgrade cycle** (index to effect): 0 "Câmera lenta", 1 "Atravessar o corpo", 2 "Pontos em dobro",
3 "Escudo", then back to 0.

**State transitions**

- Correct answer: effect becomes `cycle[cyclePosition]`; `cyclePosition = (cyclePosition + 1) mod 4`.
- Wrong answer or timeout: effect becomes "Turbo".
- A new effect replaces the current one (FR-030).
- `remaining` decreases only in `JOGANDO`. When it reaches 0 the effect ends, except "Atravessar o corpo",
  which stays at "0 s" until the head is off the body.
- The shield ends when it cancels one collision or when `remaining` reaches 0.

## Question (from `perguntas.js`)

| Field | Type | Validation |
|-------|------|------------|
| q | string | Non-empty, at most 160 characters |
| a | list of strings | At least 4 non-empty items, each at most 40 characters; index 0 is the correct one |
| e | string | Non-empty short explanation |
| m | string | Non-empty subject |

Invalid entries are skipped (see [contracts/perguntas.md](contracts/perguntas.md)). When shown, the game
picks the correct alternative plus 3 wrong ones and shuffles them; it keeps track of which shown position is
correct.

## Question Record

| Field | Type | Notes |
|-------|------|-------|
| question | Question | Statement, explanation, subject |
| correctText | string | The right alternative |
| chosenText | string or null | Null on timeout |
| result | enum | `CERTA`, `ERRADA`, `TEMPO` |

The end-of-match review lists records whose result is `ERRADA` or `TEMPO`.

## Ranking Entry

| Field | Type | Notes |
|-------|------|-------|
| initials | string | Exactly 3 letters A-Z |
| points | integer | Greater than 0 |
| timestamp | integer | Milliseconds since epoch; used to break ties (older first) |

**Rules**: sorted by points descending, then timestamp ascending; at most 10 entries; a new score qualifies if
`points > 0` and (fewer than 10 entries or `points` is greater than the lowest entry).

## Sound Preference

| Field | Type | Notes |
|-------|------|-------|
| muted | boolean | Default false; persisted |
