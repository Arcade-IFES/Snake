# Tarefa 5 — Aplicar no Fluxo do Projeto

**Feature:** `specs/001-snake-game/` (Snake — jogo arcade educativo)

**Fontes:** `spec.md`, `plan.md`, `tasks.md` e `index.html`. As revisões detalhadas estão em `docs/revisao-ciclo-speckit.md` (Tarefa 3).

## Relatório conciso

**Spec:** Snake em grade 20x20, com 1 vida. A cada 5 frutas aparece uma fruta "?", que abre uma pergunta de 4 alternativas com 15 s para responder. Acerto dá +50 pontos e o próximo upgrade de um ciclo fixo ("Câmera lenta", "Atravessar o corpo", "Pontos em dobro", "Escudo"). Erro ou tempo esgotado mostra a resposta certa com a explicação, zera o combo e aplica "Turbo"; nunca encerra a partida. Velocidade nunca acima de 16 mov/s. No fim: revisão dos erros e ranking top-10 local. Tudo em pt-BR, no desktop e no celular.

**Plano:** um `index.html` (CSS e JS inline) + `perguntas.js`, abertos por duplo-clique (`file://`), sem build e sem dependências. Máquina com 9 estados; só `JOGANDO` avança o tempo. Loop de passo fixo com teto em `limitarVelocidade`. Som sintetizado com Web Audio. Ranking e mudo no `localStorage`, com try/catch. Release por tag `v*.*.*` conferida contra `VERSAO`. Sem desvios da constituição.

**Tasks:** 70 tasks, 69 feitas. O `tasks.md` não registra os self-tests de resposta, "Escudo", "Atravessar o corpo" e "Pontos em dobro", que já existem no código (corrigido depois; a primeira revisão disse que faltavam). Falta de fato o teste da colisão que vence a "?". T044, T045 e `plan.md` estão com texto antigo (botão de pausa só no toque; `touchend`). A Phase 11 está fora do lugar. T066 está aberta: som (F), celular real (G) e release (J).

**Implementação:** dois bugs. `index.html:1501`: `pausar()` ignora o `blur` durante a contagem 3-2-1. `index.html:1701`: o aviso do efeito repete a cada retomada da pausa. Uma regra inventada: `index.html:637` rejeita alternativas repetidas. Duas ambiguidades da spec: o contador da "?" (`index.html:576`) e quando o áudio tenta de novo (`index.html:1770`).

**Riscos:** merge sem a T066 deixa som e celular real sem validação, e a constituição exige os dois. O `tasks.md` fora de sincronia com o código esconde o que já está testado. O jogo pode começar a andar com a janela sem foco.

**Próximo passo:**
1. Corrigir os dois bugs.
2. Adicionar o teste da colisão que vence a "?", registrar os testes existentes no `tasks.md` e rodar `index.html#teste` até tudo dar "ok".
3. Atualizar T044, T045, `plan.md` e `contracts/perguntas.md`, e rodar `/speckit-clarify` para o contador da "?".
4. Fechar a T066 (som, celular real, release) e só então abrir o merge.

## Checklist para validar `/speckit.implement`

- [ ] `index.html#teste`: todas as linhas "ok", incluindo resposta, escudo, atravessar o corpo, pontos em dobro e colisão contra a "?"
- [ ] Partida completa no desktop, com teclado, incluindo uma pergunta certa, uma errada e uma por tempo
- [ ] Partida completa num celular real, só com toque, em retrato e paisagem
- [ ] Erro e tempo esgotado nunca encerram a partida e sempre mostram a resposta certa com a explicação
- [ ] Ciclo de upgrades na ordem certa em 8 acertos seguidos
- [ ] Velocidade ≤ 16 mov/s com "Turbo" no teto
- [ ] Trocar de janela durante `JOGANDO` e durante a contagem 3-2-1 pausa o jogo
- [ ] Som, música e mudo funcionando; o mudo continua após recarregar a página
- [ ] Ranking salvo continua após reabrir o navegador; com o armazenamento bloqueado aparece "Ranking indisponível neste navegador."
- [ ] `perguntas.js` renomeado mostra o aviso e desativa "Jogar"
- [ ] Tag `v*.*.*` igual a `VERSAO` publica a Release; tag diferente faz o workflow falhar

## Onde o Caveman ajudou ou atrapalhou

**Ajudou**

- Revisões curtas e acionáveis. O formato `arquivo:linha — divergência — teste` obrigou cada achado a virar uma ação verificável, e os achados sem teste possível (SC-010) apareceram logo.
- O relatório da feature cabe em uma tela. Spec de 465 linhas, plano de 132 e tasks de 439 viraram 6 blocos.
- Sem cortesia nem repetição, a decisão do grupo ficou mais rápida.

**Atrapalhou**

- Na leitura do código, a compressão do Caveman escondeu o corpo das funções (`/* caveman: body elided */`). Para revisar a lógica foi preciso recuperar o texto original. Para revisar código, a compressão da entrada atrapalha mais do que ajuda.
- A versão Ultra perdeu contexto e os porquês (Tarefa 4). O segundo risco do plano sumiu, e abreviações como "SW" e as setas custaram leitura.
- A resposta curta não substitui a conferência. Um achado (botão de pausa no desktop) parecia divergência, mas a spec já tinha sido corrigida. Duas linhas citadas também estavam erradas e foram corrigidas na conferência.

**Regra do grupo:** usar `full` ou `lite` para revisar e resumir, e não usar `ultra` como registro oficial. Na revisão de código, ler o código sem compressão.
