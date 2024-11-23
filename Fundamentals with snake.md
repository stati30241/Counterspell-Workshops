# Fundamentals of Game Design: Building a Snake Game in Javascript
By Sahibjot Singh

## What will we cover?
In this workshop we will cover the basics of what code design for game development. 

We will start off with some theory (how game engines work on a very broad level) and then use that knowledge to make a snake game.

![image](https://github.com/user-attachments/assets/788edbd5-afb5-4f33-acdd-2edbd28d5c28)


## The Game loop
Most game engines are at their core a game loop. The game loop is a loop that executes a very specific piece of code every frame.

Components of a game loop:
- **Handling Inputs**: Records and deals with the input from the user (keypresses, mouse movement)
- **Updating the game**: Uses the input to update the state of the game (move stuff around, change states, etc.)
- **Rendering**: Drawing the updated game components onto the screen

## Updating at regular intervals – Ticks
As a consequence of how we want our snake game to function, we will not update our game every frame.

Instead, we will update it every 100 milliseconds, and to do that we will implement a tick system (more on this later).

If you are a minecraft nerd, you will know that minecraft also updates in a similar fashion.

![MC-Tick-Speed-Uses](https://github.com/user-attachments/assets/4a209475-b8d4-4171-90b4-46c68171a9c4)


## Data Structures
Games and game engines need to store and process a lot of data very quickly.

For this reason, the use of specialized structures to store a certain type of data becomes very useful in order to program effectively.

For our game, the data structure that we will create and use is a 2d vector class, which will store two numbers, one for `x` and one for `y`.

If you have taken physics, you will know why vectors are useful when modeling stuff.

![2DVectors](https://github.com/user-attachments/assets/adea3892-f26b-4ff5-9b57-79d8c7b8fcaf)


## Making the Game - Setting up the enviroment
You can use any code editor to follow along. For the sake of ease, I will use [replit](https://replit.com/) for demonstration, but you are not required to use it.

Start by creating two files, `snake.html` and `snake.js`. Now we can put in some boilerplate code that will help us set up the enviroment in where we can make our game.

`snake.html`
```html
<!DOCTYPE html>
<html>

<style>
  #gameScreen {
    border: 2px solid white;
    background: #181818;
  }
</style>

<head>
  <title>Snake</title>
</head>


<body>
  <main>
    <div style="text-align: center">
      <canvas id="gameScreen" , width="625" , height="625"></canvas>
    </div>

    <script src="script.js"></script>
  </main>
</body>

</html>
```

`snake.js`
```js
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
```


## Making the Game Loop
The contents of our game loop will be contained in the `main` function, which will call itself at the end in order to let loop.

Note that the function will take one parameter, `timestamp `, which will let us keep track of how much time has elapsed between frames.

```js
function main(timestamp) {
  requestAnimationFrame(main);
}

requestAnimationFrame(main);
```


## Rendering the snake
Outside of our function, we will create a variable to represent the position of the snake at any given time. We will also 

```js
let snake = new vec2d(125, 300);
```

To actually draw a snake, inside the `main` function, we will first clear the screen, and then draw a rectangle at the snake's position, with its dimentions being the `CELL_SIZE`.

```js
// Clears the screen
context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

// Render
context.fillStyle = "#00ff00";
context.fillRect(snake.x, snake.y, CELL_SIZE, CELL_SIZE);
```

Running this code, you should see a small green square that represents our cute little snake!

![{620F10DF-2E6B-4638-83F2-DD0787C3062B}](https://github.com/user-attachments/assets/1169f840-7bb9-4f79-a97c-d741ccb24e73)


## Input handling
We want to use the WASD keys to change the direction of the snake, so first we need to make a variable to keep track of what direction the snake is moving in.

We will use a number to do this, specifically, we will use this scheme:
- 0: Right (D)
- 1: Down (S)
- 2: Left (A)
- 3: Up (W)

We can define this variable right underneath our definition of the `snake` variable.

```js
let snakeDir = 0;
```

Now to change this variable in response to user input, we need to add an event listener. This will listen to any events that happen, and let us deal with them depending on the type and specefics of the event.

```js
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
```


## Making the Snake Move
Okay we added input handling, but that doesn't do anything since the snake is unable to move!

### Tick system
To make it move, we need to now work on the update part of our game loop. But as we said before, we will update only once per tick.

To implement this tick system, we will need to define some variables which will keep track of the time elsapsed between frames, the tick speed, etc.

```js
let lastTime = 0;
let timer = 0;
const tickSpeed = 100;
```

Inside the game loop, after the input handling, we can now add code to call the tick function every time the `timer` exceeds `tickSpeed`.

```js
// Calculates the time elapsed between frames
let deltaTime = timestamp - lastTime;
lastTime = timestamp;

// Update
timer += deltaTime;
if (timer >= tickSpeed) {
  tick();
  timer = 0.0;
}
```

### The actual code to make the snake move
Now we can define a `tick` function, where all the updating can happen.

Now we will just write a switch statement where according to the `snakeDir` variable, the position of the snake gets changed.

```js
function tick() {
  // Moves the snake
  switch (snakeDir) {
    case 0:
      snake.x += CELL_SIZE;
      break;
    case 1:
      snake.y += CELL_SIZE;
      break;
    case 2:
      snake.x -= CELL_SIZE;
      break;
    case 3:
      snake.y -= CELL_SIZE;
      break;
  }
}
```

With this done, we can now see our little snake come to life!


## Adding food
Now the snake by itself is pretty lonely, so let us add some food it can eat (and still be lonely, but at least not hungry).

Like the snake, we will define a variable to store the position of the food.

```js
let food = new vec2d(325, 300);
```

And some code to render it.

```js
context.fillStyle = "#ff0000";
context.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
```

![{F9904CE9-A2B9-456D-8A49-CF58AEAE13BA}](https://github.com/user-attachments/assets/a425115a-7e92-4125-a64c-55cd8bdeabf5)


### Making the snake able to eat the food
Now the food isn't doing much, so let us implement the snake eating food mechanic. How will we do this?

Well, in our tick function, after the snake has finished updating its position, we will check if it is occupying the same space as the food. If it is, then the snake will have eaten the food, and we will generate a new place for food.

```js
// Checks if the snake has eaten the food
if (snake.x == food.x && snake.y == food.y) {
  generateFood();
}
```

### Generating the food
Everytime the snake eats the food, we need to generate a new and random position for the food to respawn in.

We will make a new function for this, called `generateFood`, and it will pick a random position on the board and make that the food's new position.

```js
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
```

Now everytime the food is eaten by the snake, it disappears and is spawned somewhere else!


## Adding the snake's body
Until now, our snake has just been a small little square, very unlike how snakes actually look. In order add the snake's body, we will stop representing our snake as a position, and will instead use an array of positions.

This array will contain the positions of each of the 'pixels' that make up the snake. For this, we will need to modify our definion of the snake variable.

```js
let snake = [new vec2d(125, 300), new vec2d(100, 300), new vec2d(75, 300)];
```

Now that `snake` is an array, we will also need to modify a lot of our code that deals with the snake.

To start with, the tick function now will need to update the entire snake, which we will do as such:

- Starting from the last pixel in the array, we will move it the position of the pixel ahead of it
- We will move the first pixel (the snake's head) according to the direction

We also need to modify the food detection code to check now if the snake's head is colliding with the food only. All in all this gives us this modified tick function.
```js
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

  // Checks if the snake has eaten the food
  if (snake[0].x == food.x && snake[0].y == food.y) {
    // Make snake longer
    generateFood();
  }
}
```

We also need to make sure that the snake grows each time it eats food, so everytime that happens, we will just push a new element onto the array that is just the last element.

```js
// Checks if the snake has eaten the food
if (snake[0].x == food.x && snake[0].y == food.y) {
  // Make snake longer
  snake.push(new vec2d(snake[snake.length - 1].x, snake[snake.length - 1].y));
  generateFood();
}
```

But we almost forgot, we still need to modify the code that is reponsible for drawing the snake. However, that is simple, we can just loop over the elements of the array and render them individually.

```js
for (let i = 0; i < snake.length; i++) {
  context.fillRect(snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
}
```


## Death Conditions
Now if you played the game we have for a bit, one thing you would have noticed is that our snake can go off screen and throught itself. This simply won't do, we need to make it so that the game ends if that happens.

Let us start off by defining a `gameOver` variable that we can set to `true` in case any of that happens.
```js
let gameOver = false;
```

Now in the `tick` function, after updating the snake's position, we can check for both of these death conditions.

```js
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
```

For checking if the snake goes out of bounds, we just need to make sure that the head stays inside the bounds, as the body just follows the head.

For checking self collisions, we can over all the pixels in the body, and check if they are colliding with the head.

If either of these are true, we will set our `gameOver` variable to `true`.


## Adding a Game Over Screen
Now we have death conditions, but nothing happens when the game over event is triggered. Well to fix that, we can just check that in our main function and execute a different game loop that corresponds to a game over screen.

```js
function main(timestamp) {
  if (gameOver) {
    // Game Over screen stuff will go here
  } else {
    // The previous game loop
  }

  requestAnimationFrame(main);
}
```

### Rendering text
When the snake dies, we can display some text that tells the user game over, and they need to restart again.

We can simply do this by rendering some text as such.

```js
// Clears the screen
context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

// Renders the text
context.font = "30px Arial";
context.fillStyle = "white";
context.textAlign = "center";
context.fillText("Press any key to replay", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
```

This will draw the text in the middle of the screen.

### Replayability
To make the user actually able to reply, we will put an another event listener that checks for keydown and if game is over, and then resets everything to the start of the game.

```js
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
```


## The end?
Now our snake game is finished, we have a snake that we can move around, grows each time it eats food, and dies if it hits the walls or itself.

However, this is not the end, now it it up to you to add more features to this game, it give it your own unique spin, or to increase the user experience.

The sky is your limit, however here are some suggestions to get your creative juices flowing.

- Keep track of the score, it increases when you eat food and is displayed after you die.
- Notice that the food can sometimes spawn inside the snake, find a way to fix this.
- Notice that the if the snake's direction was right, and you press `a`, it immediately moves back and dies, it should not be able to do that, so fix it.
- Add obstacles that the snake cannot touch.
- Make it so that if the snake goes out of bounds, it appears on the opposite side of the screen.
