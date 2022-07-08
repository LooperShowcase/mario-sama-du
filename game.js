kaboom({
  global: true,
  scale: 2,
  fullscreen: true,
  clearColor: [0.8, 0.7, 0.9, 1],
});
loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("z", "z.png");
loadSprite("coin", "coin.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("suprise_box", "surprise.png");
loadSprite("unboxed_box", "unboxed.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("star", "star.png");
loadSprite("loop", "loop.png");
loadSprite("heart", "heart.png");
loadSprite("spong", "spongebob.png");

let score = 0;
let hearts = 3;

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                      !     !       p       ",
    "                                             ",
    "         !     =======================                               ",
    "    L                                        ",
    "   ===========      *                                   ",
    "                                             ",
    "               ===u========                              ",
    "                                             ",
    "                            ===                 ",
    "                               ==             ",
    "                                             ",
    "               !           !       ===          ",
    "                                             ",
    "             ====uuu==============                                 ",
    "                                                       ",
    "     ======                !                       ",
    "                 L                         ",
    "            =========uu========   *    !                 ",
    "                                           ",
    "                                ========         ",
    "                        $$$$  L            ",
    "                       ==========                    ",
    "                                           ",
    "               !      =                      ",
    "         $$$        =                        ",
    "        =========                                    ",
    "                                         ",
    "     ===          L                              ",
    "        ===u==========*=  $                     ",
    "                        ====               ",
    "                                           ",
    "                $$$$$$          =*===         ",
    "        ====*u!========!======         !          ",
    "            e                      s       ",
    "===========================================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    u: [sprite("unboxed_box"), solid(), "unboxed_box"],
    "!": [sprite("suprise_box"), solid(), "suprise_coin"],
    "*": [sprite("suprise_box"), solid(), "suprise_star"],
    e: [sprite("evil_mushroom"), solid(), "evil_mushroom", body()],
    $: [sprite("coin"), "coin"],
    "^": [sprite("star"), "star", body()],
    p: [sprite("pipe"), solid(), "pipe"],
    L: [sprite("loop"), "loop"],
    s: [sprite("spong"), solid(), "spong"],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("z"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score:0")]);
  const heartObj = add([
    sprite("heart"),
    text("     x3", 12),
    origin("center"),
  ]);

  keyDown("right", () => {
    player.move(150, 0);
  });

  keyDown("left", () => {
    player.move(-150, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("suprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("suprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("^", obj.gridPos.sub(0, 1));
    }
  });

  action("star", (obj) => {
    obj.move(10, 0);
  });

  player.collides("coin", (obj) => {
    destroy(obj);
    score += 1;
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(4);
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    heartObj.pos = player.pos.sub(400, 170);
    scoreLabel.text = "score: " + score;
    heartObj.text = "     x" + hearts;
    if (hearts <= 0) {
      go("lose");
    }
  });

  action("evil_mushroom", (obj) => {
    obj.move(-15, 0);
  });

  action("spong", (obj) => {
    obj.move(-15, 0);
  });

  player.collides("spong", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });

  let lastGrounded = true;
  player.collides("evil_mushroom", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.action(() => {
    lastGrounded = player.grounded();
  });

  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("Level2");
    });
  });

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y > 1000) {
      hearts--;
    }
  });

  //scene end
});

scene("lose", () => {
  add([
    text("game over \nyou lost\npress the space\nbutton to\nrestart", 30),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    hearts = 3;
    go("game");
  });
});

scene("won", () => {
  add([
    text(" you won\npress the space\nbutton to\nrestart", 30),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});
scene("how to play", () => {
  add([
    text(
      "how to play\nto go left & right use\nthe left & right arows\n& to jump use the \nspace button\n& to start now \npress space",
      15
    ),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});

scene("Level2", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "          p                                  ",
    "                   L                         ",
    "          ==================                 ",
    "                                $            ",
    "           !!!               u=u=u=uu                  ",
    "          $$$$$$$$ $$$$   L                ",
    "       =u========uuuuu========                                        ",
    "                                              ",
    "  ===   $$                                      ",
    "       u=u=u===u  L                            ",
    "                =======uu=    $$$$            ",
    "                             ======u=u=      ",
    "                                             $  L  ",
    "                *       !       !         ========  ",
    "             L               L         =     ",
    "             =========================               ",
    "             s L   $$$$$$$     $$$$$$         ",
    " ============================================= ",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    u: [sprite("unboxed_box"), solid(), "unboxed_box"],
    "!": [sprite("suprise_box"), solid(), "suprise_coin"],
    "*": [sprite("suprise_box"), solid(), "suprise_star"],
    e: [sprite("evil_mushroom"), solid(), "evil_mushroom", body()],
    $: [sprite("coin"), "coin"],
    "^": [sprite("star"), "star", body()],
    p: [sprite("pipe"), solid(), "pipe"],
    L: [sprite("loop"), "loop"],
    s: [sprite("spong"), solid(), "spong"],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("z"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score:0")]);
  const heartObj = add([
    sprite("heart"),
    text("     x3", 12),
    origin("center"),
  ]);

  keyDown("right", () => {
    player.move(150, 0);
  });

  keyDown("left", () => {
    player.move(-150, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("suprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("suprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("^", obj.gridPos.sub(0, 1));
    }
  });

  action("star", (obj) => {
    obj.move(10, 0);
  });

  player.collides("coin", (obj) => {
    destroy(obj);
    score += 1;
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(4);
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    heartObj.pos = player.pos.sub(400, 170);
    scoreLabel.text = "score: " + score;
    heartObj.text = "     x" + hearts;
    if (hearts <= 0) {
      go("lose");
    }
  });

  action("evil_mushroom", (obj) => {
    obj.move(-15, 0);
  });

  action("spong", (obj) => {
    obj.move(-15, 0);
  });

  player.collides("spong", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });

  let lastGrounded = true;
  player.collides("evil_mushroom", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.action(() => {
    lastGrounded = player.grounded();
  });

  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("Level3");
    });
  });

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y > 1000) {
      hearts--;
    }
  });
});
scene("Level3", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                             p               ",
    "                      $$$$$$$$$$$$$$$$$$$   L     s    e                     ",
    "                     ======uuuuuuuuu==========================               ",
    "               $$$ L                                                         ",
    "            ==========                                                       ",
    "                          L                                                  ",
    "                        ========        L      L$$$$$$$$$                    ",
    "                                     ====================                    ",
    "                                                            L$$$             ",
    "                                                          ==========         ",
    "                                                                             ",
    "                                            $$$$$$$$         L       ===     ",
    "                                           ===uuu======u====u======          ",
    "                                                                             ",
    "                                         =    L                              ",
    "                                            ====                             ",
    "                                                    ==u====                  ",
    "                                                            L   $$$          ",
    "                                               !            =====u=====      ",
    "         !        !                               L    $$$                   ",
    "                                              ==uuuu=======                  ",
    "           $$$$$$$    L      $$$$                                            ",
    " ========uuuu===================u===========                                 ",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    u: [sprite("unboxed_box"), solid(), "unboxed_box"],
    "!": [sprite("suprise_box"), solid(), "suprise_coin"],
    "*": [sprite("suprise_box"), solid(), "suprise_star"],
    e: [sprite("evil_mushroom"), solid(), "evil_mushroom", body()],
    $: [sprite("coin"), "coin"],
    "^": [sprite("star"), "star", body()],
    p: [sprite("pipe"), solid(), "pipe"],
    L: [sprite("loop"), "loop"],
    s: [sprite("spong"), solid(), "spong"],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("z"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score:0")]);
  const heartObj = add([
    sprite("heart"),
    text("     x3", 12),
    origin("center"),
  ]);

  keyDown("right", () => {
    player.move(150, 0);
  });

  keyDown("left", () => {
    player.move(-150, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("suprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }
    if (obj.is("suprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("^", obj.gridPos.sub(0, 1));
    }
  });

  action("star", (obj) => {
    obj.move(10, 0);
  });

  player.collides("coin", (obj) => {
    destroy(obj);
    score += 1;
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(4);
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    heartObj.pos = player.pos.sub(400, 170);
    scoreLabel.text = "score: " + score;
    heartObj.text = "     x" + hearts;
    if (hearts <= 0) {
      go("lose");
    }
  });

  action("evil_mushroom", (obj) => {
    obj.move(-15, 0);
  });

  action("spong", (obj) => {
    obj.move(-15, 0);
  });

  player.collides("spong", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });

  let lastGrounded = true;
  player.collides("evil_mushroom", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.action(() => {
    lastGrounded = player.grounded();
  });

  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("won");
    });
  });

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y > 1000) {
      hearts--;
    }
  });
});

start("how to play");
