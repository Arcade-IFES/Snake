# Contract: `perguntas.js` (Question Bank)

The game and the educator share this file format. It is the Part I, Principle VI contract, plus the Snake
limits from the spec.

## File

- Name: `perguntas.js`, next to `index.html`.
- Loaded by a classic `<script src="perguntas.js">` tag before the game script.
- MUST declare exactly one global: `const PERGUNTAS = [ ... ];`

## Entry shape

```js
{
  q: "Qual é a capital do Brasil?",
  a: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
  e: "Brasília é a capital federal desde 1960.",
  m: "Geografia"
}
```

| Field | Meaning | Rules |
|-------|---------|-------|
| `q` | Statement | Non-empty text, at most 160 characters |
| `a` | Alternatives | At least 4 non-empty texts, each at most 40 characters; the first is always correct; the game shuffles and shows four |
| `e` | Explanation | Non-empty short text shown after answering |
| `m` | Subject | Non-empty text used for balanced drawing |

## Game behavior

| Condition | Behavior |
|-----------|----------|
| File missing, unreadable, or `PERGUNTAS` undefined | Title screen shows "Perguntas não encontradas. Verifique o arquivo perguntas.js." and "Jogar" is disabled |
| `PERGUNTAS` is empty, or no valid entry | Same warning and disabled "Jogar" |
| An entry breaks a rule above | That entry is skipped; the others are used; the console lists the skipped indexes |
| Fewer valid questions than a match needs | The drawing restarts from the full valid bank after every question was used |
| More than 4 alternatives | Correct one plus 3 randomly chosen wrong ones are shown |

## Content rules (from the constitution and spec)

- Original or properly licensed; no copying from exams, textbooks, or other games; credits in the README.
- Portuguese (pt-BR).
- General knowledge and high-school content for Ifes students.
- At least 60 questions across at least 5 subjects in the shipped file.
