# Tarefa 3 — Revisar o Ciclo Spec-Kit com Caveman

**Feature:** `specs/001-snake-game/`

**Fases escolhidas:** Tasks e Implement. Escolhemos essas duas porque o código já existe. Assim a revisão compara artefato com artefato e artefato com código real, sem hipóteses.

**Como foi feito:** os prompts da tarefa rodaram com o Caveman ativo (modo `full`) no Claude Code. Cada achado foi conferido no arquivo citado antes de entrar aqui.

---

## Revisão 1 — Tasks

### Pedido feito

```text
/caveman full
Compare tasks.md com spec.md e plan.md.
Liste tasks faltantes, fora de escopo, sem teste ou em ordem errada.
```

### Resposta concisa

**Faltantes**

- SC-010 (90% dos alunos entendem a explicação, medido em sala): nenhuma task. Não dá para medir no código; precisa de uma task de teste com turma ou sair dos critérios.
- Edge case "Sound cannot start: retries on the next interaction": T057 só fala em retomar no primeiro gesto. A nova tentativa a cada interação não tem task.

**Fora de escopo / desatualizadas**

- T044 diz que o botão de pausa aparece "on touch devices". A spec foi corrigida (FR-013: "o mesmo botão também aparece no desktop") e a T070 resolveu isso, mas a T044 e o `plan.md` (seção Input) continuam com o texto antigo.
- T045 manda usar `touchstart` e `touchend`. O código decide no `touchmove`. A spec (FR-012) não exige nenhum dos dois, então o erro está na task, não no código.

**Sem teste**

- T035 (tratamento da resposta): nenhum self-test cobre bônus de 50 sem combo (FR-034), combo zerado no erro, "Turbo" aplicado e "nunca encerra a partida" (FR-022). A T026 testa só a ordem do ciclo e o teto de velocidade.
- T030 ("?" e colisão no mesmo passo, a colisão vence): sem teste.
- T031: "Escudo" (anula uma batida, cobra parada no tick) e "Atravessar o corpo" expirando sobre o corpo: sem teste. São as duas regras mais fáceis de quebrar.
- FR-027 ("Pontos em dobro" dobra também o bônus): sem teste.

**Ordem errada / estrutura**

- A Phase 11 (T068–T070) foi colada depois de "Notes", fora da seção "Dependencies & Execution Order", e sem checkpoint.
- T044 (botão de pausa) está na US7, mas o checkpoint da US6 depende dela. A dependência está escrita, mas a fase da US6 não pode fechar sozinha.
- T066 continua aberta (F, G e J pendentes). É um quality gate de merge (Princípio XI), então a feature não está pronta para merge.

### Decisão do grupo

| Achado | Decisão |
|--------|---------|
| Self-tests de T035, T030, T031 e FR-027 | **Aceito.** Criar uma task nova de testes antes do próximo merge. São regras do núcleo educativo e hoje só têm teste manual. |
| T044 e `plan.md` com o texto antigo do botão de pausa | **Aceito.** Corrigir o texto para bater com FR-013. |
| T045 `touchend` contra `touchmove` | **Aceito.** Atualizar a task para descrever o código, que atende FR-012. |
| Phase 11 fora do lugar | **Aceito.** Mover para antes de "Dependencies" e marcar a dependência com Phase 10. |
| SC-010 sem task | **Adiado.** Vira uma atividade de sala com o professor, fora do `tasks.md`. |
| Nova tentativa de áudio | **Rejeitado como task nova.** Ver a Revisão 2: o código já tenta de novo a cada partida, e o grupo acha que basta. |
| T066 aberta | **Mantido.** Não abrir o merge até ouvir o som (F), jogar num celular real (G) e rodar a release (J). |

---

## Revisão 2 — Implement

### Pedido feito

```text
/caveman-review
Compare o código implementado com spec.md.
Formato: arquivo:linha — divergência — teste necessário.
```

### Resposta concisa

- `index.html:1501` — `pausar()` só age em `JOGANDO`. Um `blur` durante `CONTAGEM` é ignorado: a contagem termina e a cobra anda com a janela sem foco (US7 AS4: "during a match"). — Teste: começar a partida, trocar de janela durante o 3-2-1 e esperar `PAUSADO`.
- `index.html:1701` — `anunciarEfeitoAtual()` roda em toda saída de `CONTAGEM`, inclusive ao voltar da pausa. O aviso e o som do efeito repetem sem um efeito novo (FR-038 pede o aviso no início do efeito). — Teste: pegar "Câmera lenta", pausar e retomar; o aviso não deve aparecer de novo.
- `index.html:637` — `validarPergunta` rejeita alternativas repetidas (`new Set(p.a).size`). A regra não está na spec nem em `contracts/perguntas.md`: é um requisito inventado. — Teste: decidir a regra; se ficar, documentar no contrato e no README e adicionar um self-test.
- `index.html:576` — o contador de frutas para a "?" só anda quando não há "?" no tabuleiro, e zera quando ela aparece, não quando é comida. A US2 AS1 diz "since the last '?' fruit", o que é ambíguo. — Teste: comer 3 frutas com a "?" na tela, depois comer a "?"; confirmar quantas frutas faltam para a próxima.
- `index.html:1770` — o áudio tenta retomar no primeiro gesto e em cada `iniciarPartida()`, não "na próxima interação" (edge case "Sound cannot start"). — Teste: bloquear o áudio, clicar na tela de título e conferir quando o som volta.
- `index.html:1433` — o botão aparece também no desktop. **Não é divergência**: FR-013 foi atualizado pela T070.

Conferido sem divergência: teto de 16 mov/s com "Turbo" (12 × 1,4 → 16), colisão vence a "?" no mesmo passo, "Atravessar o corpo" fica em "0 s" sobre o corpo, escudo parado no tick, bônus fora do combo e dobrado por "Pontos em dobro", desempate do ranking (mais antigo primeiro), e todas as frases da spec presentes no HTML.

### Decisão do grupo

| Achado | Decisão |
|--------|---------|
| `pausar()` ignora `CONTAGEM` | **Aceito como bug.** Pausar também em `CONTAGEM`, porque a spec fala em "during a match". |
| Aviso de efeito repetido ao retomar | **Aceito como bug.** Anunciar só quando o efeito começa, não em todo `CONTAGEM → JOGANDO`. |
| Rejeição de alternativas repetidas | **Manter no código e documentar.** Duas alternativas iguais quebram o "1 de 4". Registrar a regra em `contracts/perguntas.md` e na spec. |
| Contador da "?" | **Esclarecer a spec.** Rodar `/speckit-clarify` e escrever "contado a partir do momento em que a '?' aparece". O código fica como está. |
| Nova tentativa de áudio | **Aceitar o comportamento atual.** Ajustar o texto do edge case para "tenta de novo ao iniciar a partida". |

---

## O que aprendemos

- A revisão de **Tasks** achou mais **lacunas de teste**. A de **Implement** achou mais **bugs de estado** (pausa e contagem). As duas se completam: os dois bugs estão justamente em regras que a revisão de Tasks apontou como sem self-test.
- O formato `arquivo:linha — divergência — teste` obrigou cada achado a virar uma ação verificável. Os achados sem teste possível (SC-010) apareceram logo.
- Mesmo comprimida, a resposta precisou de conferência humana. Um achado ("botão de pausa no desktop") parecia divergência, mas a spec já tinha sido atualizada.
