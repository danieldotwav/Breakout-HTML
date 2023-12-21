const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

const NUM_BRICKS_PER_ROW = 14;
const BRICK_GAP = 2;
const WALL_WIDTH = 10; // Wall width
const BRICK_WIDTH = (CANVAS_WIDTH - (WALL_WIDTH * 2) - (BRICK_GAP * (NUM_BRICKS_PER_ROW - 1))) / NUM_BRICKS_PER_ROW;
const BRICK_HEIGHT = 16;

const PADDLE_WIDTH = BRICK_WIDTH * 2;
const PADDLE_HEIGHT = BRICK_HEIGHT / 2;

const ORIGINAL_BALL_SIZE = 5;

const bricks = [];

const canvas = document.getElementById('game');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const context = canvas.getContext('2d');

const LVL1 = [
    [],
    [],
    [],
    [],
    [],
    [],
    ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F']
];

// Map color names to characters for ease-of-change
const colorMap = {
    'C': '#800020',  //CRIMSON
    'R': '#B33D26',  //RED
    'O': '#DE754C',  //ORANGE
    'Y': '#DDA46F',  //YELLOW
    'G': '#789F90',  //GREEN
    'L': '#387F97',  //LIGHTBLUE
    'B': '#236192',  //DARKBLUE
    'F': '#2C3968',  //FORDBLUE
    'P': 'lightgrey' //PADDLE COLOR
};

const paddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: 440,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 0 // Paddle x velocity
};

const ball = {
    x: canvas.width / 2,
    y: 260,
    width: 5,
    height: 5,
    speed: 1,
    dx: 0, // Ball x velocity
    dy: 0  // Ball y velocity
};

/////////////////////////////////
/// MUTATORS AND ACCESSORS
////////////////////////////

const ORIGINAL_BALL_SPEED = ball.speed;
const ORIGINAL_PADDLE_WIDTH = paddle.width;

function setPaddlePosition(horizontalPosition, verticalPosition) {
    paddle.x = horizontalPosition;
    paddle.y = verticalPosition;
}

function setPaddleWidth(newWidth) { paddle.width = newWidth; }
function getOriginalPaddleWidth() { return ORIGINAL_PADDLE_WIDTH; }


function setBallPosition(horizontalPosition, verticalPosition) {
    ball.x = horizontalPosition;
    ball.y = verticalPosition;
}

function setBallSpeed(newSpeed) {
    let ratioX = ball.dx / ball.speed;
    let ratioY = ball.dy / ball.speed;

    ball.speed = newSpeed;

    // Adjust dx and dy based on the new speed while maintaining direction
    ball.dx = ratioX * ball.speed;
    ball.dy = ratioY * ball.speed;
}

function setBallSize(newSize) {
    ball.height = newSize;
    ball.width = newSize;
}


/////////////////////////////////
/// GAME FUNCTIONS
////////////////////////////

function createGameGrid() {
    for (let row = 0; row < LVL1.length; row++) {
        for (let col = 0; col < LVL1[row].length; col++) {
            const colorCode = LVL1[row][col];

            bricks.push({
                x: WALL_WIDTH + (BRICK_WIDTH + BRICK_GAP) * col,
                y: WALL_WIDTH + (BRICK_HEIGHT + BRICK_GAP) * row,
                color: colorMap[colorCode],
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT
            });
        }
    }
}

// Check for collision between two objects using axis-aligned bounding box (AABB)
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Score: ${score}`;

    // Increase ball speed every 20 points
    if (score % 20 == 0) {
        updateBallSpeed();
    }
}

function updateBallSpeed() {
    const speedIncreaseFactor = 1.1;
    ball.speed *= speedIncreaseFactor;

    // Update the ball's velocity components based on the new speed
    // Preserve the direction of the ball while updating speed
    ball.dx = (ball.dx / Math.abs(ball.dx)) * ball.speed;
    ball.dy = (ball.dy / Math.abs(ball.dy)) * ball.speed;
}

function showGameOver() {
    const gameOverElement = document.getElementById('game-over');
    gameOverElement.style.display = 'block'; // Display the Game Over text
}

function hideGameOver() {
    const gameOverElement = document.getElementById('game-over');
    gameOverElement.style.display = 'none';
}

function showWinScreen() {
    const gameOverElement = document.getElementById('winner');
    gameOverElement.style.display = 'block'; // Display the Game Over text
}

function hideWinScreen() {
    const gameOverElement = document.getElementById('winner');
    gameOverElement.style.display = 'none';
}

// When initializing or resetting the ball's position and movement
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = paddle.y - ball.height; // Position the ball just above the paddle
    ball.dx = ball.speed * (Math.random() < 0.5 ? -1 : 1); // Randomize left or right direction
    ball.dy = -ball.speed; // Always move up
}

function resetPaddle() {
    paddle.x = canvas.width / 2 - PADDLE_WIDTH / 2;
    paddle.y = 440;
    width: PADDLE_WIDTH;
    height: PADDLE_HEIGHT;
    dx: 0;
}


//////////////////////////////
/// GAME LOOP
/////////////////////////

// Global flags for each powerup
let slowBallActive = false;
let widePaddleActive = false;
let powerupActive = false;
let bigBallActive = false;

let widePaddleDuration = 0;
let slowBallDuration = 0;
let bigBallDuration = 0;

let previousBallSpeed = 0;

let score = 0;
let isGameOver = false;

createGameGrid();
loop();
function loop() {
    if (!isGameOver) {
        // Ensure next frame is scheduled before current frame logic is processed for smoother animations
        requestAnimationFrame(loop);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Move Paddle and Paddle
        movePaddle();
        moveBall()

        // Check Ball Collision
        checkBallPaddleCollision();
        checkBallBrickCollision();

        // Draw Walls
        drawWalls();

        // Draw Ball
        drawBall();

        // Draw Bricks
        drawBricks();

        // Draw Paddle
        drawPaddle();

        // Check Remaining Bricks
        if (bricks.length == 0) {
            isGameOver = true;
        }
    }
    else {
        if (bricks.length == 0) {
            showWinScreen();
        }
        else {
            showGameOver();
        }
    }
}

//////////////////////////////
/// GAME FUNCTIONS
/////////////////////////

const POWERUP_CHANCE = 0.10; // 10% chance for powerup
const POWERUP_DURATION = 7;

// Add: 1. AI OVERRIDE 2. BIG BALL
const POWERUP_TYPES = {
    WIDER_BAR: 'wider_bar',
    SLOW_BALL: 'slow_ball',
    BIG_BALL: 'big_ball'
}

function movePaddle() {
    paddle.x += paddle.dx;
    // Collision with walls
    if (paddle.x < WALL_WIDTH) {
        paddle.x = WALL_WIDTH;
    }
    else if (paddle.x + paddle.width > canvas.width - WALL_WIDTH) {
        paddle.x = canvas.width - WALL_WIDTH - paddle.width;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision logic
    // Left & Right walls
    if (ball.x < WALL_WIDTH || ball.x + ball.width > canvas.width - WALL_WIDTH) {
        ball.dx *= -1;
    }
    // Top wall
    if (ball.y < WALL_WIDTH) {
        ball.dy *= -1;
    }

    // Reset ball if it goes below the screen
    if (ball.y > canvas.height) {
        isGameOver = true;
    }
}
function checkBallPaddleCollision() {
    // If ball collides with paddle, change y velocity
    if (collides(ball, paddle)) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.height;
    }
}

function checkBallBrickCollision() {
    let collisionOccurred = false;

    for (let i = 0; i < bricks.length && !collisionOccurred; i++) {
        const brick = bricks[i];

        if (collides(ball, brick)) {
            // Remove brick from the bricks array
            bricks.splice(i, 1);

            // Increment score
            score++;
            updateScore();

            // Update Powerup Gauge
            updatePowerupGauge();

            // Check For Powerup Chance
            checkForRandomPowerupChance();

            // Calculate where the ball hit the brick
            const ballBottom = ball.y + ball.height;
            const ballTop = ball.y;
            const brickBottom = brick.y + brick.height;
            const brickTop = brick.y;
            const ballCenterX = ball.x + ball.width / 2;
            const ballCenterY = ball.y + ball.height / 2;
            const brickCenterX = brick.x + brick.width / 2;
            const brickCenterY = brick.y + brick.height / 2;

            // Determine the side of the collision
            const hitVertical = Math.abs(ballCenterX - brickCenterX) < brick.width / 2;
            const hitHorizontal = Math.abs(ballCenterY - brickCenterY) < brick.height / 2;

            // Ball hits the brick from the bottom or top
            if (hitVertical && !hitHorizontal) {
                ball.dy *= -1;
            }
            // Ball hits the brick from the side
            else if (hitHorizontal && !hitVertical) {
                ball.dx *= -1;
            }
            // Corner hit, reflect both axes
            else {
                ball.dx *= -1;
                ball.dy *= -1;
            }
            collisionOccurred = true;
        }
    }
}

function getRandomPowerup() {
    const keys = Object.keys(POWERUP_TYPES);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return POWERUP_TYPES[keys[randomIndex]];
}

function displayPowerupText(text) {
    const powerupTextElement = document.getElementById('powerupText');
    powerupTextElement.textContent = text;
    powerupTextElement.style.display = 'block';
    setTimeout(() => powerupTextElement.style.display = 'none', 5000); // Hide the text after 5 seconds
}

function checkForRandomPowerupChance() {
    if (Math.random() < POWERUP_CHANCE && !powerupActive) {
        powerupActive = true; // Global flag indicating a powerup is active
        let selectedPowerup = getRandomPowerup();

        // Activate the selected powerup and set the respective flag
        if (selectedPowerup === POWERUP_TYPES.SLOW_BALL && !slowBallActive) {
            slowBallDuration = 3;
            previousBallSpeed = ball.speed;
            setBallSpeed(ball.speed / 2);
            slowBallActive = true; // Set the slow ball flag
            displayPowerupText('SLOWWWW');
        }
        else if (selectedPowerup === POWERUP_TYPES.WIDER_BAR && !widePaddleActive) {
            widePaddleDuration = POWERUP_DURATION;
            setPaddleWidth(paddle.width * 2);
            widePaddleActive = true; // Set the wide paddle flag
            displayPowerupText('WIDE PADDLE');
        }
        else if (selectedPowerup === POWERUP_TYPES.BIG_BALL && !bigBallActive) {
            bigBallDuration = POWERUP_DURATION;
            setBallSize(12);
            bigBallActive = true; // Set the wide paddle flag
            displayPowerupText('BIG BALL');
        }
    }
}

function updatePowerupGauge() {
    if (widePaddleDuration > 0) {
        --widePaddleDuration;
        if (widePaddleDuration === 0) {
            setPaddleWidth(getOriginalPaddleWidth()); // Reset paddle width
            widePaddleActive = false;
        }
    }

    if (slowBallDuration > 0) {
        --slowBallDuration;
        if (slowBallDuration === 0) {
            setBallSpeed(ORIGINAL_BALL_SPEED); // Reset ball speed
            slowBallActive = false;
        }
    }

    if (bigBallDuration > 0) {
        --bigBallDuration;
        if (bigBallDuration === 0) {
            setBallSize(ORIGINAL_BALL_SIZE); // Reset ball speed
            bigBallActive = false;
        }
    }

    powerupActive = widePaddleActive || slowBallActive || bigBallActive;
}
function drawWalls() {
    context.fillStyle = colorMap['P'];
    context.fillRect(0, 0, canvas.width, WALL_WIDTH);
    context.fillRect(0, 0, WALL_WIDTH, canvas.height);
    context.fillRect(canvas.width - WALL_WIDTH, 0, WALL_WIDTH, canvas.height);
}

function drawBall() {
    if (ball.dx || ball.dy) {
        context.fillRect(ball.x, ball.y, ball.width, ball.height);
    }
}

function drawBricks() {
    bricks.forEach(function (brick) {
        context.fillStyle = brick.color;
        context.fillRect(brick.x, brick.y, brick.width, brick.height);
    });
}

function drawPaddle() {
    context.fillStyle = colorMap['P'];
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function resetGame() {
    // Reset Score
    score = 0;
    updateScore();

    // Reset the game state flags
    isGameOver = false;
    slowBallActive = false;
    widePaddleActive = false;
    powerupActive = false;
    widePaddleDuration = 0;
    slowBallDuration = 0;

    // Reset any powerups if active
    setBallSpeed(ORIGINAL_BALL_SPEED);
    setPaddleWidth(ORIGINAL_PADDLE_WIDTH);

    // Hide the Game Over Text
    hideGameOver();
    hideWinScreen();

    // Repopulate the bricks array for a new game
    bricks.length = 0; // Clear the existing bricks;
    createGameGrid();

    // Reset Ball Position/Velocity
    resetBall();
    resetPaddle();

    // Restart the game loop
    requestAnimationFrame(loop);
}


//////////////////////////////
/// UTILITY
/////////////////////////

let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;
let lastSecond = Date.now();

function animate(currentTime) {
    // Calculate the time difference
    let deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Increment the frame count
    frameCount++;

    // Update the FPS every second
    if (currentTime - lastSecond >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastSecond = currentTime;

        // Update FPS display on the page
        document.getElementById('fpsCounter').innerText = `FPS: ${fps}`;
    }

    // Request the next frame
    requestAnimationFrame(animate);
}

// Start the animation
//requestAnimationFrame(animate);

//////////////////////////////
/// DIRECTIONAL MOTION
/////////////////////////

let leftArrowPressed = false;
let rightArrowPressed = false;
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
        leftArrowPressed = true;
        paddle.dx = -3;
    }
    if (e.key === 'ArrowRight') {
        rightArrowPressed = true;
        paddle.dx = 3;
    }

    if (ball.dx === 0 && ball.dy === 0 && e.key === ' ') {
        resetBall();
    }
});

// Stop paddle movement when keys are released
document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft') {
        leftArrowPressed = false;
    }
    if (e.key === 'ArrowRight') {
        rightArrowPressed = false;
    }

    if (!leftArrowPressed && !rightArrowPressed) {
        paddle.dx = 0;
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === " " && isGameOver) { // If spacebar is pressed and the game is over
        resetGame();
    }
});

//////////////////////////////
/// MOBILE SUPPORT
/////////////////////////

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);
let gameStarted = false;

// Listen for touchstart events on the canvas
canvas.addEventListener('touchstart', function (e) {
    // Get the touch coordinates
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    // Adjust touch coordinates for canvas position
    const canvasRect = canvas.getBoundingClientRect();
    const canvasScaleX = canvas.width / canvasRect.width; // scale factor for width
    const canvasScaleY = canvas.height / canvasRect.height; // scale factor for height

    const canvasTouchX = (touchX - canvasRect.left) * canvasScaleX;
    const canvasTouchY = (touchY - canvasRect.top) * canvasScaleY;

    // Check if the touch is within the paddle's bounds
    if (
        canvasTouchX >= paddle.x &&
        canvasTouchX <= paddle.x + paddle.width &&
        canvasTouchY >= paddle.y &&
        canvasTouchY <= paddle.y + paddle.height
    ) {
        // If the game hasn't started, start the game
        if (!gameStarted) {
            gameStarted = true;
            resetBall(); // Start the ball movement
            loop(); // Start the game loop
        }
    }
}, false);

let lastTouchX;

function handleTouchStart(e) {
    const touch = e.touches[0];
    lastTouchX = touch.clientX;
    e.preventDefault(); // Prevent scrolling when touching the canvas
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchX;
    lastTouchX = touch.clientX;

    // Move paddle based on the change in touch position
    paddle.x += deltaX;

    // Prevent the paddle from going out of bounds
    if (paddle.x < WALL_WIDTH) {
        paddle.x = WALL_WIDTH;
    } else if (paddle.x + paddle.width > canvas.width - WALL_WIDTH) {
        paddle.x = canvas.width - WALL_WIDTH - paddle.width;
    }

    e.preventDefault();
}

function handleTouchEnd(e) {
    // Stop paddle movement when touch ends
    paddle.dx = 0;
    e.preventDefault();
}

window.addEventListener('deviceorientation', handleTilt);

function handleTilt(e) {
    // Get the device tilt from the event
    const gamma = e.gamma; // Represents the left to right tilt in degrees

    // Set the paddle velocity based on the tilt
    // You may need to adjust the sensitivity to get the desired responsiveness
    const sensitivity = 1.5;
    paddle.dx = gamma * sensitivity;
}