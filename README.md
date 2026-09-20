# Snake — Fliperama Ifes

Um jogo de cobrinha no estilo dos fliperamas antigos, com perguntas sobre bancos de dados, do inicial ao avançado.
Coma frutas para crescer e pontuar, e, de tempos em tempos, responda a uma pergunta para ganhar um
bônus. Feito para os estudantes do Ifes.

**Versão atual:** 1.0.0 (aparece no topo do jogo)

## Como abrir

1. Baixe a pasta do jogo (ou o `.zip` da página de Releases do GitHub) e extraia.
2. Dê dois cliques no arquivo `index.html`. Ele abre no navegador.

Não precisa instalar nada, nem de internet, nem de servidor. Funciona no computador e no celular.

## Como jogar

Guie a cobra pela grade de 20 por 20. A partida termina quando a cabeça bate em uma parede ou no próprio
corpo. Você tem uma vida só.

| Ação | Computador | Celular |
|------|------------|---------|
| Mover | Setas ou W, A, S, D | Deslizar o dedo na tela ou usar os botões de direção |
| Pausar e continuar | P ou Esc, ou o botão "Pausar" | Botão "Pausar" |
| Responder à pergunta | Teclas 1, 2, 3 ou 4 | Tocar na alternativa |
| Ligar ou desligar o som | M | Botão "Som" |

Uma contagem 3-2-1 aparece antes do primeiro movimento da partida e depois de cada pausa ou pergunta.
A cobra não pode dar meia-volta de uma vez. Ela começa devagar e vai ficando mais rápida a cada fruta, até
um limite de velocidade.

### A fruta "?"

A cada 5 frutas aparece uma fruta especial com um "?". Ao comê-la, o jogo para e mostra uma pergunta com
quatro alternativas e 15 segundos para responder.

- **Acertou:** você ganha 50 pontos e um bônus temporário, sempre nesta ordem, que se repete:
  1. **Câmera lenta:** a cobra anda na metade da velocidade (8 s).
  2. **Atravessar o corpo:** a cobra passa pelo próprio corpo, mas a parede continua fatal (8 s).
  3. **Pontos em dobro:** tudo que você ganha vale o dobro (10 s).
  4. **Escudo:** absorve uma batida (uma vez, ou 30 s).
- **Errou ou o tempo acabou:** o jogo mostra a resposta certa e uma explicação, zera o combo e a cobra
  fica mais rápida por um tempo (**Turbo**, 8 s). Errar nunca acaba a partida.

Só um efeito fica ativo por vez: o novo substitui o anterior. O tempo dos efeitos só corre enquanto você
joga (não durante a pausa nem durante as perguntas).

### Pontuação

- Cada fruta vale 10 pontos, multiplicados pelo **combo**.
- O combo sobe a cada 5 frutas seguidas (x1, x2, ... até x5). Uma resposta certa também conta como uma
  fruta seguida. Errar ou deixar o tempo acabar volta o combo para x1.
- Cada resposta certa dá 50 pontos de bônus (sem multiplicar pelo combo).

### Fim de jogo e ranking

No fim, o jogo mostra a **revisão das perguntas** que você errou, com a resposta certa e a explicação. Se a
sua pontuação entrar no top 10, digite três letras (suas iniciais) para salvá-la. O ranking fica guardado no
próprio navegador do seu aparelho: cada computador ou celular tem o seu.

## Como editar as perguntas

As perguntas ficam no arquivo `perguntas.js`, separado do jogo. Abra-o em qualquer editor de texto. Cada
pergunta tem este formato:

```js
{
  q: "Qual é a função de uma chave primária?",
  a: ["Identificar cada linha de forma única", "Ordenar a tabela por nome", "Criptografar os dados", "Apagar linhas repetidas sozinha"],
  e: "A chave primária identifica cada linha de modo único, sem repetição.",
  m: "Fundamentos"
}
```

- `q`: o enunciado, com no máximo 160 caracteres.
- `a`: as alternativas, com pelo menos 4 itens de até 40 caracteres cada. **A primeira é sempre a correta**:
  o jogo embaralha ao mostrar. Se houver mais de 4, o jogo sorteia 3 erradas.
- `e`: uma explicação curta, mostrada depois da resposta.
- `m`: o tópico. O jogo alterna entre os tópicos e não repete uma pergunta até usar todas.

Perguntas fora desse formato são ignoradas (o console do navegador lista quais). Se o arquivo faltar ou não
tiver nenhuma pergunta válida, a tela inicial mostra "Perguntas não encontradas. Verifique o arquivo
perguntas.js." e o botão "Jogar" fica desativado.

O jogo acompanha 60 perguntas de bancos de dados, em 6 tópicos, do mais inicial ao mais avançado:
Fundamentos, Modelagem, SQL básico, SQL avançado, Transações e índices, e NoSQL e arquitetura.

## Testes da lógica

Abra `index.html#teste` (o mesmo arquivo, com `#teste` no final do endereço) para rodar as verificações
automáticas das regras do jogo. A página mostra "ok" ou "falhou" para cada uma.

## Créditos

- **Código, arte e som:** feitos para este projeto. Os gráficos são desenhados pelo próprio jogo e os sons
  e a música são gerados na hora pelo navegador (Web Audio), sem arquivos de áudio.
- **Perguntas:** escritas para este projeto, sem cópia de provas, livros ou de outros jogos.
- **Ferramenta de especificação:** [GitHub Spec Kit](https://github.com/github/spec-kit).

## Versões e publicação

O jogo usa versionamento semântico (`MAIOR.MENOR.CORREÇÃO`). O número mora em um só lugar: a constante
`VERSAO` no começo do script de `index.html`.

Para publicar uma versão:

1. Mude `VERSAO` em `index.html` (por exemplo, para `"1.1.0"`) por meio de um Pull Request.
2. Depois do merge, crie e envie a tag `v1.1.0` (o `v` mais o mesmo número).
3. O GitHub Actions confere se a tag bate com `VERSAO` e cria a Release com o `.zip` do jogo. Se a tag e o
   número forem diferentes, a publicação falha e nenhuma Release é criada.

## Para quem desenvolve

O jogo é desenvolvido com o método Spec Kit. A constituição está em `.specify/memory/constitution.md` e a
especificação, o plano e as tarefas estão em `specs/001-snake-game/`.

Arquivos do jogo:

- `index.html`: o jogo inteiro (HTML, CSS e JavaScript, sem dependências)
- `perguntas.js`: o banco de perguntas
- `.github/workflows/release.yml`: publicação automática das Releases
