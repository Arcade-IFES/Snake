# Contract: Browser Storage (Ranking and Sound)

Only two values are persisted, in the browser's `localStorage` on the player's device. No server, account, or
network call is involved. All access goes through four small functions; no other code touches storage.

## Keys

| Key | Value | Written by | Read by |
|-----|-------|------------|---------|
| `snake.ranking` | JSON array of ranking entries | `salvarRanking(lista)` | `carregarRanking()` |
| `snake.mudo` | `"1"` (muted) or `"0"` | `salvarMudo(valor)` | `carregarMudo()` |

## Ranking value

```json
[
  { "i": "ABC", "p": 340, "t": 1789900000000 },
  { "i": "XYZ", "p": 120, "t": 1789900500000 }
]
```

| Field | Meaning | Rule |
|-------|---------|------|
| `i` | Initials | Exactly 3 characters A-Z |
| `p` | Points | Integer greater than 0 |
| `t` | Timestamp in ms | Integer; older entries rank first among equal points |

## Function contracts

| Function | Input | Output | Failure behavior |
|----------|-------|--------|------------------|
| `carregarRanking()` | none | Array of valid entries, sorted, at most 10 | Storage blocked, missing key, bad JSON, or wrong shape returns `[]`; entries that break the rules are dropped |
| `salvarRanking(lista)` | Sorted array, at most 10 | `true` if written, `false` otherwise | Never throws; on `false` the game shows "Ranking indisponível neste navegador." |
| `carregarMudo()` | none | Boolean | Any failure returns `false` (sound on) |
| `salvarMudo(valor)` | Boolean | none | Never throws; failure is ignored and the choice lasts until the page closes |

## Rules

- Storage is checked once at start-up with a test write. If it fails, `armazenamentoOk` is false, the title
  screen still works, and the game-over screen shows "Ranking indisponível neste navegador." in place of the
  initials prompt.
- The ranking is never trusted on load: every entry is re-validated, sorted, and cut to 10.
- Data is per browser and per device; there is no import, export, or sync.
