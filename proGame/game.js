const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.querySelector("#scoreEl");
const timerEl = document.querySelector("#timerEl");
let counter = 0;
let timeLeft = 60;
let score = 0;

let audio1 = new Audio();
let audio2 = new Audio();
let audio3 = new Audio();
audio1.src = "./audio/bounce.flac";
audio2.src = "./audio/bounce.flac";
audio3.src = "./audio/point.wav";

canvas.width = 800;
canvas.height = 500;

function setup() {
  timerEl.innerHTML = timeLeft - counter;

  function runit() {
    counter++;
    timerEl.innerHTML = timeLeft - counter;
    if (counter == timeLeft) {
      alert("Your Score: " + score);
      clearInterval(interval);
    }
  }

  let interval = setInterval(runit, 1000);
}
setup();

class Wall {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.velocity = {
      x: 0,
      y: Math.random() * (10 - 2) + 1,
    };
    this.width = 20;
    this.height = 139;
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.y -= this.velocity.y;
  }
}

class Goal {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 10;
    this.height = 50;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.y = this.position.y;
    this.position.x = this.position.x;
  }
}

class Player {
  constructor() {
    this.position = {
      x: 360,
      y: 90,
    };
    this.velocity = {
      x: 0,
      y: 2,
    };
    this.width = 10;
    this.height = 10;
  }

  draw() {
    ctx.beginPath();

    ctx.fillStyle = "brown";
    ctx.arc(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      Math.PI * 3,
      ctx.closePath()
    );
  }
  update() {
    this.draw();
    ctx.fill(), ctx.closePath();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (keys.right.pressed) {
      player.velocity.x = 4;
    }
    if (keys.left.pressed) {
      player.velocity.x = -4;
    }
    if (keys.up.pressed) {
      player.velocity.y = -4;
    }
    if (keys.down.pressed) {
      player.velocity.y = 4;
    }
  }
}

const goals = [new Goal({ x: 0, y: 230 }), new Goal({ x: 790, y: 230 })];
const walls = [new Wall({ x: 15, y: 170 }), new Wall({ x: 765, y: 170 })];
const player = new Player();

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update();
  goals.forEach((goal) => {
    goal.update();
    if (
      player.position.x < goal.position.x - 40 + goal.height &&
      player.position.x + player.width > goal.position.x &&
      player.position.y < goal.position.y + goal.height &&
      player.height + player.position.y > goal.position.y
    ) {
      audio3.play(), (score += 10);
      scoreEl.innerHTML = score;
    }
  });

  // Collision detection
  if (canvas.width - 780 + player.position.x <= player.width) {
    (player.velocity.x = -player.velocity.x), audio1.play();
  }
  if (player.position.x + player.width >= canvas.width) {
    (player.velocity.x = -player.velocity.x), audio2.play();
  }
  if (canvas.height - 490 + player.position.y <= player.height) {
    (player.velocity.y = -player.velocity.y), audio1.play();
  }
  if (player.position.y + player.height >= canvas.height) {
    (player.velocity.y = -player.velocity.y), audio2.play();
  }
  walls.forEach((wall) => {
    wall.update();
    if (
      player.position.x < wall.position.x - 120 + wall.height &&
      player.position.x + player.width > wall.position.x &&
      player.position.y < wall.position.y + wall.height &&
      player.height + player.position.y > wall.position.y
    ) {
      (player.velocity.x = -player.velocity.x), audio2.play();
    }
    if (canvas.height - 365 + wall.position.y <= wall.height) {
      wall.velocity.y = -Math.random() * (10 - 2) + 2;
    }
    if (wall.position.y + wall.height >= canvas.height) {
      wall.velocity.y = +Math.random() * (10 - 3) + 4;
    }
  });
}

animate();

//move player
// A:65 S:83 D:68 W:87
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      break;
    case 68:
      keys.right.pressed = true;
      break;
    case 83:
      keys.down.pressed = true;
      break;
    case 87:
      keys.up.pressed = true;
      break;
  }
});
addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      break;
    case 68:
      keys.right.pressed = false;
      break;

    case 83:
      keys.down.pressed = false;
      break;

    case 87:
      keys.up.pressed = false;
      break;
  }
});
