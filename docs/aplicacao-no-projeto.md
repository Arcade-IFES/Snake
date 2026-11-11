# Aplicação no projeto — feature `001-snake-game`

**Funcionalidade escolhida:** a feature inteira do Snake (`specs/001-snake-game/`), com foco na rodada de perguntas, nos efeitos e na pausa.

**Como foi feito:** revisamos `spec.md`, `plan.md`, `tasks.md` e `index.html` com o Caveman (`full` e `/caveman-review`), seguindo o [Guia Spec-Kit + Caveman do Grupo](guia-speckit-caveman.md). As revisões completas estão na [Tarefa 3](revisao-ciclo-speckit.md) e no [relatório da Tarefa 5](relatorio-fluxo-feature.md).

## Melhorias aplicadas

| Achado da revisão | Melhoria aplicada | Onde | Task |
|---|---|---|---|
| Sair da janela durante a contagem 3-2-1 deixava a cobra andar sem foco | `pausar()` também pausa em `CONTAGEM` | `index.html` | T071 |
| O aviso e o som do efeito repetiam a cada retomada da pausa | Cada efeito é anunciado uma vez só | `index.html` | T072 |
| "Colisão vence a ? no mesmo movimento" não tinha teste | Novo self-test | `index.html` | T073 |
| O código rejeita alternativas repetidas, mas a regra não estava escrita | Regra documentada | `spec.md`, `contracts/perguntas.md`, `README.md` | T074 |
| Spec ambígua: quando recomeça a contagem para a "?" e quando o áudio tenta de novo | Texto esclarecido conforme o comportamento do código | `spec.md` (FR-017, edge case de som) | T075 |
| FR-014 e FR-038 não cobriam a contagem e a retomada | Requisitos atualizados | `spec.md` (US7, FR-014, FR-038) | T071, T072 |
| T044, T045 e `plan.md` com texto antigo (pausa só no toque; `touchend`) | Texto alinhado com o código e com FR-013 | `tasks.md`, `plan.md` | T076 |
| Phase 11 colada depois de "Notes" | Movida para antes de "Dependencies"; Phase 12 criada com as tasks acima | `tasks.md` | — |
| Self-tests existentes não registrados no `tasks.md` | Registrados na nota da Phase 12 | `tasks.md` | — |

## Validação

- `index.html#teste` no Chrome headless: **28 de 28 testes "ok"** (eram 27; o novo é "colisão vence a ? no mesmo movimento").
- Roteiro no Chrome headless sobre uma cópia do jogo:
    - `blur` durante a contagem: o estado vai para `PAUSADO` (antes ficava em `CONTAGEM`).
    - Pausar e retomar com o mesmo efeito: o som do efeito toca 1 vez (antes tocava a cada retomada). Um efeito novo toca de novo.
- **Ainda não validado:** som e música ouvidos por uma pessoa (cenário F), partida num celular real (G) e release no GitHub (J). A T066 continua aberta e bloqueia o merge.

## Não aplicado

- **SC-010** (90% dos alunos entendem a explicação): depende de um teste em sala com o professor. Fica fora do `tasks.md`.
- **Contador da "?" e nova tentativa de áudio:** a spec foi ajustada ao código, sem rodar o `/speckit-clarify` com o grupo. Se o grupo preferir outro comportamento, a mudança volta para a spec primeiro.

## Como a abordagem melhorou o processo

- **Achamos bugs que os testes não pegavam.** Os dois bugs estavam na máquina de estados, fora da lógica pura que o `#teste` cobre. A revisão `arquivo:linha` contra a spec chegou neles.
- **Artefatos voltaram a bater com o código.** Spec, plan e tasks tinham texto antigo ou regras implícitas. Agora toda regra do código está escrita, e toda mudança tem uma task.
- **A revisão foi curta o bastante para fazer de verdade.** Três artefatos com mais de 1.000 linhas viraram listas de achados que o grupo decidiu em minutos.
- **Aprendemos onde a concisão engana.** A primeira revisão de tasks disse que faltavam testes que já existiam, porque comparou só o texto. Isso virou uma regra do guia: comparar com o código, e conferir todo achado antes de agir.
