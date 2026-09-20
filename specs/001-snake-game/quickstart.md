# Quickstart: Validate Snake End to End

A run-and-check guide for the finished game. It covers the quality gates of Part I, Principle XI. Contracts
and data details are in [contracts/](contracts/) and [data-model.md](data-model.md).

## Prerequisites

- A folder with `index.html`, `perguntas.js`, and `README.md`.
- One desktop browser with a keyboard and one phone (or a browser's phone emulation with touch).
- No install, no server, no network.

## Run

1. Double-click `index.html` (or open it in the browser through File > Open).
2. For the logic self-test, open `index.html#teste` and expect every line to say "ok" with no "falhou".

## Scenarios

### A. Classic play (User Story 1)

1. Press "Jogar". Expect a length-3 snake moving right and one fruit.
2. Steer with the arrow keys, then with W, A, S, D.
3. Press the opposite direction. Expect no reversal. Press two directions in one tick. Expect one turn.
4. Eat fruits. Expect growth, points, and a gradually faster snake.
5. Hit a wall, then start again and hit the body. Expect "Fim de jogo" both times.

### B. Question round (User Story 2)

1. Eat 5 fruits. Expect one "?" fruit.
2. Eat it. Expect the snake to stop and a question with four alternatives and a 15 s countdown.
3. Answer correctly with a number key. Expect "Resposta correta!", the explanation, 50 bonus points, then a
   3-2-1 countdown, then "Câmera lenta".
4. Repeat 4 more times with correct answers. Expect this order: "Câmera lenta", "Atravessar o corpo",
   "Pontos em dobro", "Escudo", "Câmera lenta".
5. Answer wrongly. Expect "Resposta errada!", the correct answer highlighted, the explanation, combo back to
   x1, and "Turbo".
6. Let a question time out. Expect "Tempo esgotado!" and the same penalty.
7. Confirm the match keeps running after every case, and P/Esc do nothing during a question.

### C. Effects and limits

1. With "Atravessar o corpo", cross the body; expect no game over, but a wall still ends the match.
2. With "Escudo", hit a wall once; expect the snake to stay put that tick, the shield gone, no game over.
3. With "Pontos em dobro", eat a fruit; expect double points.
4. Reach the top speed and trigger "Turbo"; expect the speed never above the 16 moves per second limit.
5. Pause during an effect; expect its timer not to advance.

### D. HUD (User Story 3)

Expect "Pontos", "Combo", "Tamanho", "Efeito" (or "Nenhum"), and "v1.0.0" visible together with the board.

### E. Summary and ranking (User Story 4)

1. Finish a match with at least one missed question. Expect "Revisão das perguntas" with each statement,
   correct answer, and explanation.
2. Finish a match with no question round. Expect "Nenhuma pergunta respondida nesta partida.".
3. Finish with a qualifying score. Expect "Novo recorde!" and "Digite suas iniciais"; enter three letters.
4. Reload the page and open "Ranking". Expect the entry to remain.
5. Fill the ranking, then finish with a higher score. Expect the lowest entry to drop.

### F. Sound (User Story 5)

1. Expect distinct sounds for fruit, "?" fruit, correct, wrong, effect start, and game over, plus music.
2. Press M and tap the sound button. Expect silence and "Som: desligado". Reload. Expect it to stay muted.

### G. Phone (User Story 6)

1. Open on the phone. Play a full match using swipes, then the arrow buttons.
2. Use the on-screen pause button. Answer a question by tapping.
3. Rotate the device. Expect the whole game visible, square cells, no horizontal scroll, and no page scroll
   while swiping.

### H. Pause (User Story 7)

Pause with P and with Esc, wait, resume. Expect a 3-2-1 countdown and no state change while paused; switch to
another tab during play and expect an automatic pause.

### I. Failure modes

1. Rename `perguntas.js`. Expect the warning "Perguntas não encontradas. Verifique o arquivo perguntas.js."
   and a disabled "Jogar", with no crash.
2. Turn off browser storage (private window or blocked site data). Expect the game to run and show "Ranking
   indisponível neste navegador." at game over.
3. Disconnect the network and reload. Expect the game to run.

### J. Release (Principle IX)

1. In a test repository, push a tag that matches `VERSAO`. Expect a Release with `snake-vX.Y.Z.zip`.
2. Push a tag that does not match. Expect the workflow to fail and no Release.

## Pass criteria

All scenarios pass on desktop and on the phone, and the spec's success criteria SC-001 to SC-012 hold.
