# Tarefa 1 — Diagnóstico de Verbosidade no Spec-Kit

**Artefato escolhido:** `specs/001-snake-game/plan.md` (saída do `/speckit.plan`, 132 linhas)

**Por que este:** o plano mistura decisões técnicas concretas com muito texto que vem do template. Isso
facilita ver o que dá para cortar.

## Legenda

| Marca | Significado |
|-------|-------------|
| 🟢 **DECISÃO** | Trecho que ajudou a tomar uma decisão de implementação |
| 🔴 **CORTE** | Transição, cortesia, repetição ou boilerplate do template |
| 🟡 **PARECE ÚTIL** | Soa importante, mas não é acionável (ninguém muda o código por causa dele) |
| ⭐ **MANTER** | Precisa ficar mesmo numa versão curta |

---

## Trechos anotados

### 1. Cabeçalho

```markdown
**Branch**: `001-snake-game` | **Date**: 2026-09-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-snake-game/spec.md`
```

> 🔴 **CORTE.** A linha `Input` repete o link `Spec` da linha de cima. A branch e a data já estão no git.
> Basta o link para a spec.

### 2. Summary

```markdown
Build Snake as a zero-install browser game: one `index.html` (inline CSS and JavaScript) plus a separate
`perguntas.js` question bank. The board is drawn on a Canvas 2D element at a fixed 20x20 logical grid. A
single fixed-step game loop advances the snake only in play time, so pause, questions, and resume countdowns
freeze every timer. [...] The ranking and the mute choice live in `localStorage` [...]
A Portuguese README documents the game.
```

> 🟢 **DECISÃO** + ⭐ **MANTER** para "fixed-step game loop advances the snake only in play time, so pause,
> questions, and resume countdowns freeze every timer". Isso definiu a arquitetura do loop e evitou o bug
> de efeitos expirarem durante uma pergunta.
>
> 🔴 **CORTE** para o resto do parágrafo. Canvas, Web Audio, `localStorage`, versão e README aparecem de
> novo em *Technical Context* e no final do plano. O Summary é um resumo de seções que vêm logo depois.

### 3. Technical Context: Constraints

```markdown
**Constraints**: Must open by double-clicking `index.html` (`file://`), so no ES modules, no `fetch` of local
files, no service worker; must work offline; [...]
```

> 🟢 **DECISÃO** + ⭐ **MANTER**. É a restrição mais acionável do documento: ela explica *por que*
> `perguntas.js` é carregado com `<script>` clássico em vez de `fetch` e por que não há `import`. Sem esse
> trecho, alguém "moderniza" o código e quebra o duplo-clique.

### 4. Technical Context: Performance Goals

```markdown
**Performance Goals**: Smooth rendering at the display refresh rate (target 60 fps on a mid-range phone);
input applied within one tick; no allocation-heavy work inside the frame loop
```

> 🟡 **PARECE ÚTIL**. "Smooth rendering" e "mid-range phone" não são verificáveis: nenhuma tarefa mede fps.
> Só "input applied within one tick" virou regra concreta (a fila de direções de duas posições, FR-006), e
> essa regra já aparece na seção *Input*.

### 5. Technical Context: Scale/Scope

```markdown
**Scale/Scope**: 1 HTML file (~1,200 lines), 1 question file (60+ questions), 9 screens, 6 sound effects, 1
music loop, 1 release workflow, 1 README
```

> 🟡 **PARECE ÚTIL**. "~1,200 lines" é uma estimativa que não orienta nenhuma decisão. As 9 telas são listadas
> de novo, com nome, em *Screens and state machine*. Só o "60+ questions" é um critério, e ele já está na
> spec.

### 6. Constitution Check

```markdown
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Status | How the plan satisfies it |
| I. Language | Pass | Spec Kit files in English; on-screen text [...] in Portuguese |
| II. Technology Stack | Pass | Plain HTML/CSS/JS, no build, no server [...] |
| ... (12 linhas, todas "Pass") ...
| S-I to S-VII (Part II) | Pass | [...] speed cap 16 moves/s enforced in one function used by base speed and by the downgrade |

No violations, so Complexity Tracking is empty.
**Post-design re-check (after Phase 1)**: Pass. The contracts add no server, dependency, or build step.
```

> 🔴 **CORTE** na linha `GATE` (instrução do template para o agente, não para o leitor) e em 11 das 12 linhas
> da tabela. Elas copiam a constituição e respondem "Pass". O leitor não ganha nada que já não esteja no
> `constitution.md`.
>
> 🔴 **CORTE** em "No violations, so Complexity Tracking is empty" e no "Post-design re-check". O primeiro
> repete a seção *Complexity Tracking* do final. O segundo repete o "Pass" da tabela.
>
> 🟢 **DECISÃO** + ⭐ **MANTER** para o fragmento da última linha: "speed cap 16 moves/s enforced in one
> function used by base speed and by the downgrade". É a única linha da tabela com decisão de design (uma
> função única, `limitarVelocidade`). Na versão curta ela vai para a seção *Game loop*.
>
> **Ressalva:** a tabela inteira só seria útil se alguma regra estivesse em "Fail". Numa versão curta,
> "Constitution Check: todas as regras passam, sem exceções" basta.

### 7. Project Structure: Documentation

```text
specs/001-snake-game/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
[...]
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

> 🔴 **CORTE**. Essa árvore é do template e é igual em todo projeto Spec-Kit. Ela descreve qual comando gerou
> cada arquivo, o que só interessa à ferramenta. Um `ls` mostra o mesmo.

### 8. Project Structure: Source Code e Structure Decision

```markdown
**Structure Decision**: a flat single-project layout. [...] Inside `index.html`, the script is organized in
labeled sections in this order: constants (`VERSAO`, grid, speeds, timings, scores), pure logic [...],
storage, audio, input, rendering, state machine, and start-up. Keeping pure logic apart from rendering and
audio lets the `#teste` self-test call it without a browser UI.
```

> 🟢 **DECISÃO** + ⭐ **MANTER**. Define a ordem das seções dentro do arquivo e dá o motivo (testabilidade da
> lógica pura pelo `#teste`). É o mapa que o `/speckit.implement` seguiu.

### 9. Screens and state machine

```markdown
`TITULO`, `JOGANDO`, `PAUSADO`, `CONTAGEM`, `PERGUNTA`, `RESULTADO`, `FIM`, `INICIAIS`, `RANKING`. Only
`JOGANDO` advances the snake and the effect timers; every other state freezes them (FR-031).
```

> 🟢 **DECISÃO** + ⭐ **MANTER**. Os nomes exatos dos estados viraram constantes no código, e a regra "só
> `JOGANDO` avança o tempo" é a invariante central do jogo.
>
> 🔴 Ela repete a frase do Summary ("freeze every timer"). Na versão curta, fica só aqui.

### 10. Input

```markdown
[...] touch through `touchstart` and `touchend` on the board with a 24 px swipe threshold and
`touch-action: none` so the page never scrolls or zooms [...] A two-slot direction queue applies one change
per tick (FR-006).
```

> 🟢 **DECISÃO** + ⭐ **MANTER**. Valores concretos (24 px, `touch-action: none`, fila de 2 posições) que foram
> direto para o código. Sem eles, cada um chutaria um valor.

### 11. Complexity Tracking

```markdown
## Complexity Tracking

No constitution violations to justify.
```

> 🔴 **CORTE**. É uma seção vazia do template, e a mesma informação já foi dita duas vezes na *Constitution
> Check*.

---

## Resumo das marcações

| # | Trecho | Marca |
|---|--------|-------|
| 1 | Linha `Input` do cabeçalho | 🔴 Corte (repetição) |
| 2 | Summary, exceto a frase do loop | 🔴 Corte (repete seções seguintes) |
| 2 | Frase do loop em tempo de jogo | 🟢⭐ Decisão / manter |
| 3 | Constraints (`file://`, sem módulos/fetch) | 🟢⭐ Decisão / manter |
| 4 | Performance Goals | 🟡 Parece útil, não acionável |
| 5 | Scale/Scope | 🟡 Parece útil, não acionável |
| 6 | Linha `GATE` + 11 linhas "Pass" | 🔴 Corte (template / repetição da constituição) |
| 6 | "No violations..." + "Post-design re-check" | 🔴 Corte (repetição) |
| 6 | Limite de 16 mov/s em uma função | 🟢⭐ Decisão / manter |
| 7 | Árvore de documentação | 🔴 Corte (boilerplate) |
| 8 | Structure Decision (ordem das seções) | 🟢⭐ Decisão / manter |
| 9 | Estados da máquina | 🟢⭐ Decisão / manter |
| 10 | Input (24 px, fila de 2) | 🟢⭐ Decisão / manter |
| 11 | Complexity Tracking vazio | 🔴 Corte (seção vazia) |

**Total:** 14 marcações (6 de preservação, 6 de corte, 2 "parece útil").

## Versão curta proposta (~25 linhas)

```markdown
# Plan: Snake — [spec](spec.md)

## Restrições
- Abre com duplo-clique (`file://`) e offline: sem ES modules, sem `fetch`, sem service worker.
- Só `index.html` (CSS/JS inline) + `perguntas.js` carregado por `<script>` clássico.
- Constituição: todas as regras passam, sem exceções.

## Arquitetura
- Seções do script, nesta ordem: constantes → lógica pura → storage → áudio → input → render →
  máquina de estados → start-up. Lógica pura isolada para o self-test `#teste`.
- Estados: TITULO, JOGANDO, PAUSADO, CONTAGEM, PERGUNTA, RESULTADO, FIM, INICIAIS, RANKING.
  Só JOGANDO avança cobra e timers de efeito (FR-031).
- Loop: `requestAnimationFrame` + acumulador de passo fixo; passo = 1/velocidade;
  `limitarVelocidade` limita a 16 mov/s para base e downgrade (FR-010).
- Render: um `<canvas>` quadrado escalado por `devicePixelRatio`; HUD e overlays em HTML.
- Input: teclado (setas, WASD, 1-4, P, Esc, M, Enter, Espaço); swipe ≥ 24 px com
  `touch-action: none`; botões na tela em touch; fila de 2 direções, 1 por tick (FR-006).
- Áudio: um `AudioContext` lazy, retomado no primeiro gesto; um ganho master que o mudo zera.
- Storage: `localStorage` (ranking, mudo) via carregar/salvar com try/catch.
- Release: tag `v*.*.*` → workflow confere tag contra `VERSAO` e publica a Release.
```

## Conclusão

O plano original tem 132 linhas. Cerca de 40% dele é template (a árvore de docs, a linha `GATE`, a seção
*Complexity Tracking*) ou repete outra parte do documento (o Summary contra o Technical Context, e "sem
violações" dito três vezes). As partes que realmente orientaram o código têm números e nomes concretos:
24 px, 16 mov/s, nomes de estados, ordem das seções, restrição `file://`. O padrão é: **trecho com valor
concreto ou com um "porque" fica; trecho que só confirma, resume ou anuncia sai.**
