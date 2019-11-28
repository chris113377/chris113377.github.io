const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const screenWidth = 1000;
const screenHeight = 500;

class GameCharacter {
  constructor(x, y, width, height, color, speedX, speedY, maxSpeed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.maxSpeed = maxSpeed;
  }

  moveHorizontally() {
    this.x += this.speedX;

    if (this.x + this.width >= screenWidth || this.x <= 0) {  
      this.speedX = -this.speedX;
    }
  }
  
  moveVertically() {
    this.y += this.speedY;

    if (this.y + this.width >= screenHeight || this.y <= 0) {  
      this.speedY = -this.speedY;
    }
  }

  moveRight() {
    this.x += this.speedX;
  }

  moveLeft() {
    this.x += -this.speedX;
  }

  moveUp() {
    this.y += -this.speedY;
  }

  moveDown() {
    this.y += this.speedY;
  }
}

const rectangle1 = new GameCharacter(250, 100, 50, 50, "yellow", 0, 5);
const rectangle2 = new GameCharacter(500, 400, 50, 50, "yellow", 0, 2);
const rectangle3 = new GameCharacter(750, 250, 50, 50, "yellow", 0, 7);
const roadBlocks = [rectangle1, rectangle2, rectangle3];

const player = new GameCharacter(10, 250, 50, 50, "blue", 15, 15, 5);

const sprites = {};

const loadSprites = function() {
  sprites.player = new Image();
  sprites.player.src = 'hero.png';

  sprites.background = new Image();
  sprites.background.src = 'floor.png';

  sprites.roadBlocks = new Image();
  sprites.roadBlocks.src = 'enemy.png';
};

document.onkeydown = (function(e) {
  let keyPressed = e.keyCode;

  if (keyPressed === 39) {
    player.moveRight();
  }
  if (keyPressed === 37) {
    player.moveLeft();
  }
  if (keyPressed === 38) {
    player.moveUp();
  }
  if (keyPressed === 40) {
    player.moveDown();
  }
})

const collision = function(rect1, rect2) {
  let xTouch = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.width, rect2.width);
  let yTouch = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.height, rect2.height);
  return xTouch && yTouch;
};

const draw = function() {
  context.clearRect(0,0, screenWidth, screenHeight);

  context.drawImage(sprites.background, 0, 0);
  context.drawImage(sprites.player, player.x, player.y);
  // context.fillStyle = player.color;
  // context.fillRect(player.x, player.y, player.width, player.height);

  roadBlocks.forEach(function(rect) {
    // context.fillStyle = rect.color;
    // context.fillRect(rect.x, rect.y, rect.width, rect.height);
    context.drawImage(sprites.roadBlocks, rect.x, rect.y);
  })
};

const update = function() {
  player.moveRight();
  player.moveLeft();
  player.moveUp();
  player.moveDown();

  roadBlocks.forEach(function(rect) {
    if (collision(player, rect)) {
      rect.speedY = 0;
    }
    rect.moveVertically();
  }) 
};

const step = function() {
  update();
  draw();
  window.requestAnimationFrame(step);
};

loadSprites();
step();