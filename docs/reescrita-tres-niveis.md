# Tarefa 2 — Reescrever o Artefato em Três Níveis

**Artefato:** `specs/001-snake-game/plan.md` (o mesmo da Tarefa 1).

**Como foi feito:** o Caveman não estava instalado, então reescrevemos manualmente com o prompt da tarefa:

> Reescreva esta resposta em modo conciso. Preserve causa, ação, risco e teste. Remova cortesia, justificativa genérica e repetição.

## Contagem

| Versão | Palavras | Caracteres | Tokens (aprox.) | % do original |
|--------|---------:|-----------:|----------------:|--------------:|
| Original (`plan.md`) | 1166 | 8030 | ~2000 | 100% |
| Lite | 531 | 3448 | ~860 | ~46% |
| Full | 262 | 1696 | ~425 | ~22% |
| Ultra | 99 | 662 | ~165 | ~9% |

Palavras e caracteres foram contados com `wc -w` e `wc -m`. Os tokens são uma estimativa (caracteres ÷ 4), não uma medição do tokenizer.

## O que cada nível preservou

| Item | Lite | Full | Ultra |
|------|:----:|:----:|:-----:|
| **Causa:** restrição `file://`/offline | ✅ com explicação | ✅ | ✅ |
| **Ação:** ordem das seções, estados, loop, input, storage, release | ✅ | ✅ | ✅ |
| **Risco:** `import` quebra o duplo-clique; efeito expira durante a pergunta | ✅ ambos | ✅ ambos | ⚠️ só o primeiro |
| **Teste:** `#teste` + quickstart | ✅ | ✅ | ✅ |
| Motivo de cada decisão ("para que…", "evita…") | ✅ | ✅ curto | ❌ |
| Visão geral / contexto para quem chega agora | ✅ | ❌ | ❌ |

**Cortado nos três níveis:** a árvore de documentação do template, a linha `GATE`, a tabela da Constitution Check (virou "passa em toda a constituição"), a seção Complexity Tracking vazia, Performance Goals, Scale/Scope e as repetições do Summary.

---

## Versão Lite (531 palavras)

*Profissional e sem enrolação, mas ainda explica os motivos.*

Spec: [spec.md](spec.md)

### Visão geral

O jogo roda no navegador sem instalação: um único `index.html` (CSS e JavaScript inline) e um banco de perguntas separado, `perguntas.js`. O tabuleiro é um grid lógico de 20x20 desenhado em Canvas 2D. Todas as telas fazem parte de uma única máquina de estados.

### Restrições

- **O jogo precisa abrir com duplo-clique (`file://`) e funcionar offline.** Por isso não usamos ES modules, `fetch` de arquivos locais nem service worker, e `perguntas.js` é carregado por um `<script>` clássico. *Risco:* trocar para `import` ou `fetch` funciona num servidor local, mas quebra o duplo-clique sem nenhum aviso.
- Não há dependências de runtime nem de build. Usamos só APIs do navegador: Canvas 2D, Web Audio, Web Storage, eventos de toque e Page Visibility.
- O texto do jogo, os comentários e os identificadores do código ficam em pt-BR.
- O plano atende a todas as regras da constituição, sem exceções.

### Arquitetura

**Organização do script.** As seções aparecem nesta ordem: constantes (`VERSAO`, grid, velocidades, tempos, pontos), lógica pura, armazenamento, áudio, input, renderização, máquina de estados e inicialização. A lógica pura fica separada para que o self-test `#teste` consiga chamá-la sem a interface.

**Máquina de estados.** Os estados são `TITULO`, `JOGANDO`, `PAUSADO`, `CONTAGEM`, `PERGUNTA`, `RESULTADO`, `FIM`, `INICIAIS` e `RANKING`. Só `JOGANDO` move a cobra e desconta o tempo dos efeitos; todos os outros estados congelam esses timers (FR-031). *Risco:* se o tempo dos efeitos for contado pelo relógio, um efeito pode acabar enquanto o jogador responde a uma pergunta.

**Loop do jogo.** Usa `requestAnimationFrame` com um acumulador de passo fixo. O passo vale `1 / velocidade` e é recalculado a cada tick. A função `limitarVelocidade` limita a velocidade a 16 movimentos por segundo, tanto na velocidade base quanto no downgrade (FR-010). Ter uma função só evita que os dois caminhos tenham limites diferentes.

**Renderização.** Um único `<canvas>`, dimensionado pelo container para manter as células quadradas e escalado por `devicePixelRatio`. O HUD e as telas sobrepostas são HTML, o que deixa o texto nítido e acessível.

**Input.** O teclado usa setas, WASD, 1-4, P, Esc, M, Enter e Espaço. No toque, o swipe vale a partir de 24 px, e `touch-action: none` impede que a página role ou dê zoom. Aparelhos com toque mostram botões de direção e de pausa na tela. Uma fila de duas direções aplica uma mudança por tick (FR-006), para que duas teclas rápidas não façam a cobra virar sobre si mesma.

**Áudio.** Há um único `AudioContext`, criado só quando necessário e retomado no primeiro gesto do jogador. Todo o som passa por um ganho master, que o mudo zera.

**Armazenamento.** O ranking e a preferência de mudo ficam no `localStorage`, acessados por `carregarRanking`, `salvarRanking`, `carregarMudo` e `salvarMudo`, todos com try/catch. Se o storage estiver bloqueado, o jogo continua funcionando.

**Release.** Uma tag `v*.*.*` dispara um workflow que confere se a tag bate com a constante `VERSAO` e só então publica a Release.

### Testes

- **Self-test:** abrir `index.html#teste` executa os testes da lógica pura e mostra o resultado no console e na página.
- **Manual:** os cenários do `quickstart.md`, em desktop e celular, incluindo som e mudo.

---

## Versão Full (262 palavras)

*Frases curtas, com foco em diagnóstico e ação.*

Spec: [spec.md](spec.md). Passa em toda a constituição.

### Restrições
- Abre com duplo-clique (`file://`) e offline. Sem ES modules, `fetch` ou service worker.
- `perguntas.js` entra via `<script>` clássico.
- Risco: `import`/`fetch` funciona em servidor e quebra o duplo-clique sem erro visível.
- Zero dependências. Só APIs do navegador.

### Arquitetura
- **Script, nesta ordem:** constantes → lógica pura → storage → áudio → input → render → estados → start-up. Lógica pura isolada para o `#teste`.
- **Estados:** TITULO, JOGANDO, PAUSADO, CONTAGEM, PERGUNTA, RESULTADO, FIM, INICIAIS, RANKING.
- Só JOGANDO avança a cobra e os timers de efeito (FR-031). Risco: com relógio real, o efeito expira durante a pergunta.
- **Loop:** `requestAnimationFrame` + acumulador de passo fixo. Passo = 1/velocidade.
- `limitarVelocidade` limita a 16 mov/s para a base e o downgrade (FR-010). Uma função só, um limite só.
- **Render:** um canvas quadrado escalado por `devicePixelRatio`. HUD e overlays em HTML.
- **Input:** setas, WASD, 1-4, P, Esc, M, Enter, Espaço. Swipe ≥ 24 px com `touch-action: none`. Botões na tela em aparelhos touch.
- Fila de 2 direções, 1 por tick (FR-006). Evita a cobra virar sobre si mesma.
- **Áudio:** `AudioContext` lazy, retomado no primeiro gesto. O mudo zera o ganho master.
- **Storage:** ranking e mudo no `localStorage`, com try/catch. Storage bloqueado não trava o jogo.
- **Release:** tag `v*.*.*` → workflow confere tag = `VERSAO` → publica a Release.

### Teste
- `index.html#teste`: lógica pura, resultado no console e na página.
- Cenários do quickstart em desktop e celular, incluindo som e mudo.

---

## Versão Ultra (99 palavras)

*O mínimo necessário para agir.*

- `file://` + offline → sem modules/fetch/SW; `perguntas.js` via `<script>`. Risco: `import` quebra duplo-clique.
- Ordem: const → lógica pura → storage → áudio → input → render → estados → start.
- Estados: TITULO JOGANDO PAUSADO CONTAGEM PERGUNTA RESULTADO FIM INICIAIS RANKING. Só JOGANDO conta tempo (FR-031).
- Loop rAF passo fixo; `limitarVelocidade` ≤ 16 mov/s (FR-010).
- Swipe ≥ 24 px, `touch-action: none`; fila 2 direções, 1/tick (FR-006).
- Áudio: ganho master; mudo = 0.
- `localStorage` + try/catch.
- Tag `v*.*.*` = `VERSAO` → Release.
- Teste: `#teste` + quickstart desktop/celular.

---

## Observações

- **Lite** serve para quem chega agora no projeto, como um novo membro do grupo ou um revisor de PR. Explica o *porquê*, que é o que impede alguém de "consertar" uma decisão intencional.
- **Full** é o melhor equilíbrio para o dia a dia. Com menos de 1/4 do tamanho original, mantém todos os riscos e motivos em uma frase cada.
- **Ultra** funciona como lembrete para quem já conhece o projeto, ou como contexto barato para o agente. O custo é perder o segundo risco (o efeito expirar durante uma pergunta) e todos os "porquês". Por isso, o Ultra não deve ser o único registro da decisão.
- A redução do original para o Lite (~54%) veio quase toda de boilerplate e repetição, sem perder informação. Do Full para o Ultra, cada corte já tira algum conteúdo.
