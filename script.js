let main = document.querySelector(".main");
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");

let playField = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let score = 0;
let currentLevel = 1;
let possibleLevels = {
  1: {
    scorePerLine: 10,
    speed: 500,
    nextLevelScore: 500,
  },
  2: {
    scorePerLine: 20,
    speed: 400,
    nextLevelScore: 1000,
  },
  3: {
    scorePerLine: 30,
    speed: 300,
    nextLevelScore: 2000,
  },
  4: {
    scorePerLine: 40,
    speed: 200,
    nextLevelScore: 4000,
  },
  5: {
    scorePerLine: 50,
    speed: 100,
    nextLevelScore: 8000,
  },
  6: {
    scorePerLine: 60,
    speed: 50,
    nextLevelScore: Infinity,
  },
};

let activeTetro = {
  x: 0,
  y: 0,
  shape: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
};

let figures = {
  O: [
    [1, 1],
    [1, 1],
  ],
  I: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

function draw() {
  let mainInnerHTML = "";
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] === 1) {
        mainInnerHTML += '<div class="cell movingCell"></div>';
      } else if (playField[y][x] === 2) {
        mainInnerHTML += '<div class="cell fixedCell"></div>';
      } else {
        mainInnerHTML += '<div class="cell"></div>';
      }
    }
  }
  main.innerHTML = mainInnerHTML;
}

function removePrevActiveTetro() {
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] === 1) {
        playField[y][x] = 0;
      }
    }
  }
}

function addActiveTetro() {
  removePrevActiveTetro();
  for (y = 0; y < activeTetro.shape.length; y++) {
    for (x = 0; x < activeTetro.shape[y].length; x++) {
      if (activeTetro.shape[y][x] === 1) {
        playField[activeTetro.y + y][activeTetro.x + x] =
          activeTetro.shape[y][x];
      }
    }
  }
}

function rotateTetro() {
  const prevTetroState = activeTetro.shape;

  activeTetro.shape = activeTetro.shape[0].map((val, index) =>
    activeTetro.shape.map((row) => row[index]).reverse()
  );

  if (hasCollisions()) {
    activeTetro.shape = prevTetroState;
  }
}

function hasCollisions() {
  for (y = 0; y < activeTetro.shape.length; y++) {
    for (x = 0; x < activeTetro.shape[y].length; x++) {
      if (
        activeTetro.shape[y][x] &&
        (playField[activeTetro.y + y] === undefined ||
          playField[activeTetro.y + y][activeTetro.x + x] === undefined ||
          playField[activeTetro.y + y][activeTetro.x + x] === 2)
      ) {
        return true;
      }
    }
  }
  return false;
}

function removeFullLines() {
  let canRemoveLine = true;
  let filledLines = 0;
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] !== 2) {
        canRemoveLine = false;
        break;
      }
    }
    if (canRemoveLine) {
      playField.splice(y, 1);
      playField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      filledLines += 1;
    }
    canRemoveLine = true;
  }

  switch (filledLines) {
    case 1:
      score += 10;
      break;
    case 2:
      score += 10 * 3;
      break;
    case 3:
      score += 10 * 6;
      break;
    case 4:
      score += 10 * 12;
      break;
  }

  scoreElem.innerHTML = score;

  if (score >= possibleLevels[currentLevel].nextLevelScore) {
    currentLevel++;
    levelElem.innerHTML = currentLevel;
  }
}

function getNewTetro() {
  const possibleFigures = "IOLJTSZ";
  const rand = Math.floor(Math.random() * 7);
  return figures[possibleFigures[rand]];
}

function fixTetro() {
  for (let y = 0; y < playField.length; y++) {
    for (let x = 0; x < playField[y].length; x++) {
      if (playField[y][x] === 1) {
        playField[y][x] = 2;
      }
    }
  }
}

function moveTetroDown() {
  activeTetro.y += 1;
  if (hasCollisions()) {
    activeTetro.y -= 1;
    fixTetro();
    removeFullLines();
    activeTetro.shape = getNewTetro();
    activeTetro.x = Math.floor((10 - activeTetro.shape[0].length) / 2);
    activeTetro.y = 0;
  }
}

document.onkeydown = function (e) {
  if (e.keyCode === 37) {
    activeTetro.x -= 1;
    if (hasCollisions()) {
      activeTetro.x += 1;
    }
  } else if (e.keyCode === 39) {
    activeTetro.x += 1;
    if (hasCollisions()) {
      activeTetro.x -= 1;
    }
  } else if (e.keyCode === 40) {
    moveTetroDown();
  } else if (e.keyCode === 38) {
    rotateTetro();
  }
  addActiveTetro();
  draw();
};

scoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

addActiveTetro();
draw();

function startGame() {
  moveTetroDown();
  addActiveTetro();
  draw();
  setTimeout(startGame, possibleLevels[currentLevel].speed);
}

setTimeout(startGame, possibleLevels[currentLevel].speed);
