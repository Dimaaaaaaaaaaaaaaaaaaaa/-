const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const tileCount = canvas.width / tileSize;

let player = { x: 10, y: 10 };
let coin = randomTile();
let velocity = { x: 0, y: 0 };
let speed = 200;
let score = 0;

const audio = new Audio('sosat.mp3');

let showMessage = false;
let messageTimer = null;

function randomTile() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize - 2, tileSize - 2);
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Монеты: " + score, 10, 25);
}

function drawMessage() {
  if (showMessage) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("СОСАТЬ", canvas.width / 2 - 80, canvas.height / 2);
  }
}

function updateGame() {
  player.x += velocity.x;
  player.y += velocity.y;

  if (player.x < 0 || player.x >= tileCount || player.y < 0 || player.y >= tileCount) {
    alert("Ты въехал в стену. Монет собрано: " + score);
    document.location.reload();
  }

  if (player.x === coin.x && player.y === coin.y) {
    score++;
    audio.play();
    coin = randomTile();
    speed = Math.max(50, speed - 10);
    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, speed);

    // Показать сообщение
    showMessage = true;
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => {
      showMessage = false;
    }, 1000);
  }

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawTile(coin.x, coin.y, "gold");
  drawTile(player.x, player.y, "#0f0");
  drawScore();
  drawMessage();
}

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowUp" && velocity.y === 0) {
    velocity = { x: 0, y: -1 };
  }
  if (e.key === "ArrowDown" && velocity.y === 0) {
    velocity = { x: 0, y: 1 };
  }
  if (e.key === "ArrowLeft" && velocity.x === 0) {
    velocity = { x: -1, y: 0 };
  }
  if (e.key === "ArrowRight" && velocity.x === 0) {
    velocity = { x: 1, y: 0 };
  }
});

let gameLoop = setInterval(updateGame, speed);