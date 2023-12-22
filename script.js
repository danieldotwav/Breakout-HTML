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

const LVL2 = [
    [],
    [],
    ['C', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'R', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'O', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'Y', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'L', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'B', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'F', 'X', 'X', 'X', 'X', 'X', 'X'],
];

const LVL3 = [
    [],
    [],
    [],
    ['X', 'X', 'X', 'X', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'O', 'Y', 'O', 'X', 'X', 'X', 'O', 'Y', 'O', 'X', 'X'],
    ['X', 'X', 'O', 'Y', 'G', 'Y', 'O', 'X', 'O', 'Y', 'G', 'Y', 'O', 'X'],
    ['X', 'O', 'Y', 'G', 'L', 'G', 'Y', 'O', 'Y', 'G', 'L', 'G', 'Y', 'O'],
    ['O', 'Y', 'G', 'L', 'B', 'L', 'G', 'Y', 'G', 'L', 'B', 'L', 'G', 'Y'],
    ['X', 'O', 'Y', 'G', 'L', 'G', 'Y', 'O', 'Y', 'G', 'L', 'G', 'Y', 'O'],
    ['X', 'X', 'O', 'Y', 'G', 'Y', 'O', 'X', 'O', 'Y', 'G', 'Y', 'O', 'X'],
    ['X', 'X', 'X', 'O', 'Y', 'O', 'X', 'X', 'X', 'O', 'Y', 'O', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'X', 'X', 'X'],
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

let currentLevel = 1;
function createGameGrid(level) {
    for (let row = 0; row < level.length; row++) {
        for (let col = 0; col < level[row].length; col++) {
            const colorCode = level[row][col];

            if (colorCode !== 'X') {
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
    setLevelNumber(level);
    updateLevelText(currentLevel);
}

function setLevelNumber(level) {
    switch (level) {
        case LVL1:
            currentLevel = 1;
            break;
        case LVL2:
            currentLevel = 2;
            break;
        case LVL3:
            currentLevel = 3;
            break;
    }
}

function updateLevelText(newLevel) {
    var levelElement = document.getElementById('level');
    levelElement.textContent = 'LEVEL ' + newLevel;
}

function getCurrentLevelGrid() {
    switch (currentLevel) {
        case 1:
            return LVL1;
            break;
        case 2:
            return LVL2;
            break;
        case 3:
            return LVL3;
            break;
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

const POWERUP_CHANCE = 1;
const POWERUP_COOLDOWN = 3;

const WIDE_BAR_DURATION = 6;
const SLOW_BALL_DURATION = 4;
const BIG_BALL_DURATION = 6;

// Global flags for each powerup
let slowBallActive = false;
let widePaddleActive = false;
let powerupActive = false;
let bigBallActive = false;

let powerupDuration = 0;
let powerupCooldown = POWERUP_COOLDOWN;

let widePaddleDuration = 0;
let slowBallDuration = 0;
let bigBallDuration = 0;

let previousBallSpeed = 0;

let score = 0;
let isGameOver = false;
let isPaused = false;

createGameGrid(LVL1);
loop();

function loop() {
    if (!isGameOver && !isPaused) {
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
    else if (isPaused) {
        // Render the pause menu
        showPauseMenu();
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

function showPauseMenu() {
    // Create an offscreen canvas
    let offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    let offscreenContext = offscreenCanvas.getContext('2d');

    // Draw the current game state to the offscreen canvas
    offscreenContext.drawImage(canvas, 0, 0);

    // Draw the blurred image back to the main canvas
    context.drawImage(offscreenCanvas, 0, 0);

    // Semi-transparent overlay
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the pause menu text

    context.fillStyle = '#FFFFFF';
    context.font = '18px "Press Start 2P", cursive';
    context.textAlign = 'center';
    context.fillText('Level Selection', canvas.width / 2, 150);
    context.fillText('1. Level 1', canvas.width / 2, 200);
    context.fillText('2. Level 2', canvas.width / 2, 250);
    context.fillText('3. Level 3', canvas.width / 2, 300);
}

function showStartMessage() {
    // Create an offscreen canvas
    let offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    let offscreenContext = offscreenCanvas.getContext('2d');

    // Draw the current game state to the offscreen canvas
    offscreenContext.drawImage(canvas, 0, 0);

    // Set text properties
    context.fillStyle = '#FFFFFF'; // White color for text
    context.font = '18px "Press Start 2P", cursive'; // Your desired font
    context.textAlign = 'center';
    context.textBaseline = 'middle'; // Align text in the middle vertically

    // Draw the text at the center of the canvas
    context.fillText('-- Press Spacebar To Start --', canvas.width / 2, canvas.height / 2);
}

//////////////////////////////
/// GAME FUNCTIONS
/////////////////////////

// Add: 1. AI OVERRIDE 2. MULTI-BALL
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
            ++score;
            updateScore();

            // Decrement Powerup Cooldown
            --powerupCooldown;

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
    if (Math.random() < POWERUP_CHANCE && !powerupActive && powerupCooldown === 0) {
        powerupActive = true; // Global flag indicating a powerup is active
        let selectedPowerup = getRandomPowerup();

        // Activate the selected powerup and set the respective flag
        if (selectedPowerup === POWERUP_TYPES.SLOW_BALL && !slowBallActive) {
            powerupDuration = SLOW_BALL_DURATION;
            previousBallSpeed = ball.speed;
            setBallSpeed(ball.speed / 2);
            slowBallActive = true; // Set the slow ball flag
            displayPowerupText('SLOWWWW');
        }
        else if (selectedPowerup === POWERUP_TYPES.WIDER_BAR && !widePaddleActive) {
            powerupDuration = WIDE_BAR_DURATION;
            setPaddleWidth(paddle.width * 2);
            widePaddleActive = true; // Set the wide paddle flag
            displayPowerupText('WIDE PADDLE');
        }
        else if (selectedPowerup === POWERUP_TYPES.BIG_BALL && !bigBallActive) {
            powerupDuration = BIG_BALL_DURATION;
            setBallSize(12);
            bigBallActive = true; // Set the wide paddle flag
            displayPowerupText('BIG BALL');
        }
        powerupCooldown = POWERUP_COOLDOWN;
    }
}

function updatePowerupGauge() {
    if (powerupDuration > 0) {
        --powerupDuration;

        if (powerupDuration === 0) {
            if (widePaddleActive) {
                setPaddleWidth(getOriginalPaddleWidth()); // Reset paddle width
                widePaddleActive = false;
            }

            if (slowBallActive) {
                setBallSpeed(ORIGINAL_BALL_SPEED); // Reset ball speed
                slowBallActive = false;
            }

            if (bigBallActive) {
                setBallSize(ORIGINAL_BALL_SIZE); // Reset ball speed
                bigBallActive = false;
            }
            powerupCooldown = POWERUP_COOLDOWN;
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

function resetGame(levelSelection) {
    // Reset Score
    score = 0;
    updateScore();

    // Reset the game state flags
    isGameOver = false;
    isPaused = false;

    slowBallActive = false;
    widePaddleActive = false;
    bigBallActive = false;
    powerupActive = false;

    powerupDuration = 0;
    powerupCooldown = POWERUP_COOLDOWN;

    widePaddleDuration = 0;
    slowBallDuration = 0;
    bigBallDuration = 0;

    // Reset any powerups if active
    setBallSpeed(ORIGINAL_BALL_SPEED);
    setPaddleWidth(ORIGINAL_PADDLE_WIDTH);

    // Hide the Game Over Text
    hideGameOver();
    hideWinScreen();

    // Repopulate the bricks array for a new game
    bricks.length = 0; // Clear the existing bricks;
    createGameGrid(levelSelection);

    // Reset Ball Position/Velocity
    resetBall();
    resetPaddle();

    // Restart the game loop
    requestAnimationFrame(loop);
}

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
        resetGame(getCurrentLevelGrid());
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        isPaused = !isPaused;
        if (!isPaused) {
            // Resume the game
            requestAnimationFrame(loop);
        }
    }
    else if (isPaused) {
        if (event.key === '1') {
            // Load level 
            isPaused = false; // Unpause the game
            resetGame(LVL1);
        }
        else if (event.key === '2') {
            // Load level 2
            isPaused = false; // Unpause the game
            resetGame(LVL2);
        }
        else if (event.key === '3') {
            // Load level 3
            isPaused = false; // Unpause the game
            resetGame(LVL3);
        }
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