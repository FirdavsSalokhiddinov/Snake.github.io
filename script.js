const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    
    // Displaying "You Lose" text and restart button
    const gameOverDiv = document.createElement('div');
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.style.color = 'red';
    gameOverDiv.style.fontSize = '3rem';
    gameOverDiv.innerText = 'You Lose';
    
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.style.fontSize = '1.5rem';
    restartButton.style.padding = '10px 20px';
    restartButton.style.marginTop = '20px';
    restartButton.style.cursor = 'pointer';
    restartButton.style.background = 'red';
    restartButton.onclick = () => location.reload(); // Reloads the page when clicked
    
    gameOverDiv.appendChild(restartButton);
    document.body.appendChild(gameOverDiv);
}

const changeDirection = e => {
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}; border-radius: 50%;"></div>`;

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;

        const audio = new Audio('food.mp3');
        audio.play();
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        const audio = new Audio('gameover.mp3');
        audio.play();
        return gameOver = true;
        
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        if (i === 0) {
            // If it's the snake's head, add eyes
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; border-radius: 50%; position: relative;">`;
            html += `<div class="eye" style="position: absolute; top: 25%; left: 25%; width: 20%; height: 20%; background: black; border-radius: 50%;"></div>`;
            html += `<div class="eye" style="position: absolute; top: 25%; right: 25%; width: 20%; height: 20%; background: black; border-radius: 50%;"></div>`;
            html += `</div>`;
        } else {
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; border-radius: 50%;"></div>`;
        }

        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
