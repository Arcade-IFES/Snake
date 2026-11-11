# Guia Spec-Kit + Caveman do Grupo

Este guia diz como o grupo usa o **Caveman** (respostas concisas) em cada fase do **Spec-Kit**. Ele resume o que aprendemos nos exercícios da aula 12 e na revisão da feature `001-snake-game`.

## A ideia em uma frase

O Spec-Kit gera artefatos longos de propósito. O Caveman serve para **revisar e resumir** esses artefatos rápido, mas **não substitui** o artefato nem a conferência humana.

## Qual nível usar

| Nível | Quando usar | Quando não usar |
|---|---|---|
| `lite` | Resumir `plan.md` para quem chega agora; texto que outra pessoa vai ler | — |
| `full` | Revisões do dia a dia: comparar artefatos, listar lacunas | Registro oficial de uma decisão que precisa do "porquê" |
| `ultra` | Lembrete para quem já conhece o projeto; contexto barato para o agente | Como único registro: perde o contexto, os porquês e riscos secundários (Tarefa 4) |
| `/caveman-review` | Revisar código contra a spec, um achado por linha | — |

**Regra:** o artefato do Spec-Kit continua sendo a fonte da verdade. O texto do Caveman é uma visão de trabalho, não um substituto.

## O fluxo, fase por fase

### 1. `/speckit-specify` → `spec.md`

Depois de gerar a spec, compare com o pedido original:

```text
/caveman full
Compare spec.md com o pedido original (campo Input).
Liste apenas requisitos inventados, faltantes, ambíguos ou fora de escopo.
```

Achado ambíguo vira pergunta no `/speckit-clarify`. Não resolva a ambiguidade só no código.

### 2. `/speckit-plan` → `plan.md`

```text
/caveman lite
Resuma plan.md em:
Decisões:
Contratos:
Dados:
Riscos:
Dúvidas:
```

Use `lite`, não `ultra`. No Snake, o `ultra` perdeu o segundo risco do plano (efeito expirando durante a pausa ou a pergunta).

### 3. `/speckit-tasks` → `tasks.md`

```text
/caveman full
Compare tasks.md com spec.md, plan.md e o código já existente.
Liste tasks faltantes, fora de escopo, sem teste ou em ordem errada.
```

**Cuidado:** inclua o código na comparação quando ele já existe. Na nossa revisão, comparar só o texto do `tasks.md` gerou um falso "sem teste": os testes existiam no código, só não estavam registrados.

### 4. `/speckit-implement` → código

```text
/caveman-review
Compare o código implementado com spec.md.
Formato: arquivo:linha — divergência — teste necessário.
```

Cada achado precisa de um teste ou uma verificação. Achado sem teste possível é sinal de requisito mal escrito.

### 5. Fechamento da feature

```text
/caveman full
Resuma a feature em:
Spec:
Plano:
Tasks:
Implementação:
Riscos:
Próximo passo:
```

## Regras do grupo

1. **Confira todo achado no arquivo citado** antes de agir. Nos exercícios, duas linhas citadas estavam erradas, e um achado ("botão de pausa no desktop") já tinha sido resolvido na spec.
2. **Leia código sem compressão.** A compressão de entrada do Caveman escondeu o corpo das funções (`/* caveman: body elided */`). Para revisar lógica, recupere o original.
3. **Cada achado termina numa decisão:** aceitar, adiar, rejeitar ou esclarecer. Registre a decisão, não só o achado.
4. **Melhoria aplicada vira task.** Toda mudança vinda da revisão entra no `tasks.md` com ID, para o artefato acompanhar o código.
5. **Ambiguidade vai para a spec**, via `/speckit-clarify`, mesmo quando o código já tem um comportamento.
6. **Sem abreviações inventadas nem setas** nas respostas. "SW" e "→" custaram mais leitura do que economizaram.
7. **Rode `index.html#teste`** depois de qualquer mudança no código. Todas as linhas precisam dar "ok".

## Checklist de revisão de uma feature

- [ ] `spec.md` comparada com o pedido original; ambiguidades levadas ao `/speckit-clarify`
- [ ] Resumo `lite` do `plan.md` com riscos e dúvidas
- [ ] `tasks.md` comparado com spec, plan **e código**
- [ ] `/caveman-review` do código, com um teste por achado
- [ ] Cada achado conferido no arquivo e com decisão registrada
- [ ] Melhorias aplicadas e registradas como tasks
- [ ] `index.html#teste` todo "ok"
- [ ] Quickstart rodado no desktop e no celular antes do merge

## Onde o Caveman ajudou e onde atrapalhou

| Ajudou | Atrapalhou |
|---|---|
| Revisões curtas, com um achado acionável por linha | Compressão da entrada escondeu o código que precisava ser revisado |
| Formato `arquivo:linha — divergência — teste` deixou claro o que não dava para testar | `ultra` perdeu contexto e porquês |
| Relatório da feature coube em uma tela | Resposta curta passa confiança demais: houve falso positivo e linhas erradas |
| Menos texto para o grupo discutir, decisão mais rápida | Comparar só artefatos, sem o código, gerou um achado errado |
