// Canvas and context
let canvas = document.getElementById("gameScreen");
let context = canvas.getContext("2d");

// Screen
const SCREEN_WIDTH = 625;
const SCREEN_HEIGHT = 625;
const CELL_SIZE = 25;

// A simple 2d vector structure
class vec2d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Game
let lastTime = 0;
let timer = 0;
const tickSpeed = 100;
let gameOver = false;

// Snake
let snake = [new vec2d(125, 300), new vec2d(100, 300), new vec2d(75, 300)];
let snakeDir = 0;
let food = new vec2d(325, 300);

// Generates the food at a random position
function generateFood() {
  food.x = Math.floor(Math.random() * (SCREEN_WIDTH / CELL_SIZE)) * CELL_SIZE;
  food.y = Math.floor(Math.random() * (SCREEN_HEIGHT / CELL_SIZE)) * CELL_SIZE;

  // Try again if food is inside the snake
  for (let i = 0; i < snake.length; i++) {
    if (food.x == snake[i].x && food.y == snake[i].y) {
      generateFood();
    }
  }
}

// Tick function
function tick() {
  // Update the snake's body
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }

  // Moves the snake's head
  switch (snakeDir) {
    case 0:
      snake[0].x += CELL_SIZE;
      break;
    case 1:
      snake[0].y += CELL_SIZE;
      break;
    case 2:
      snake[0].x -= CELL_SIZE;
      break;
    case 3:
      snake[0].y -= CELL_SIZE;
      break;
  }

  // Checks if the snake is out of bounds
  if (snake[0].x < 0 || snake[0].x >= SCREEN_WIDTH ||
    snake[0].y < 0 || snake[0].y >= SCREEN_HEIGHT) {
    gameOver = true;
  }

  // Checks if the snake is colliding with itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      gameOver = true;
    }
  }

  // Checks if the snake has eaten the food
  if (snake[0].x == food.x && snake[0].y == food.y) {
    // Make snake longer
    snake.push(new vec2d(snake[snake.length - 1].x, snake[snake.length - 1].y));
    generateFood();
  }
}

// Main game loop
function main(timestamp) {
  if (gameOver) {
    // Input handling
    document.addEventListener("keydown", event => {
      if (gameOver) {
        gameOver = false;

        // Resets everything
        snake = [new vec2d(125, 300), new vec2d(100, 300), new vec2d(75, 300)];
        snakeDir = 0;
        food = new vec2d(325, 300);
        score = 0;
      }
    });
    
    // Clears the screen
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Renders the text
    context.font = "30px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Press any key to replay", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  } else {
    // Input handling
    document.addEventListener("keydown", event => {
      switch (event.key) {
        case "w":
          snakeDir = 3;
          break;
        case "a":
          snakeDir = 2;
          break;
        case "s":
          snakeDir = 1;
          break;
        case "d":
          snakeDir = 0;
          break;
      }
    });
  
    // Calculates the time elapsed between frames
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
  
    // Update
    timer += deltaTime;
    if (timer >= tickSpeed) {
      tick();
      timer = 0.0;
    }
  
    // Clears the screen
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
    // Render
    context.fillStyle = "#00ff00";
    for (let i = 0; i < snake.length; i++) {
      context.fillRect(snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
    }
  
    context.fillStyle = "#ff0000";
    context.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
  }
    
  requestAnimationFrame(main);
}

requestAnimationFrame(main);
