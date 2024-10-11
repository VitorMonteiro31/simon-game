let gameSequence = [];
let playerSequence = [];
let level = 0;
let highScore = 0;
let isPlayerTurn = false;
const statusDisplay = document.getElementById('status');
const colorButtons = document.querySelectorAll('.color-button');
const startButton = document.getElementById('start-btn');
let availableColors = ['green', 'red', 'yellow', 'blue']; // Cores iniciais

// Sons para os botões
const sounds = {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    purple: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    orange: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    pink: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    black: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
    SPECIAL: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
};

// Iniciar o jogo
startButton.addEventListener('click', () => {
    if (level === 0) {
        startGame();
    } else {
        stopGame();
    }
});

// Função para carregar o recorde salvo
document.addEventListener('DOMContentLoaded', () => {
    loadHighScore();
});

function startGame() {
    resetGame();
    nextRound();
    startButton.textContent = "Stop Game"; // Muda o texto para "Stop Game"
}

function stopGame() {
    isPlayerTurn = false; // Impede o jogador de jogar
    statusDisplay.textContent = 'Game stopped. Press Start to play again.';
    startButton.textContent = "Start Game"; // Muda o texto de volta para "Start Game"
    resetGame(); // Reseta o jogo para o estado inicial
}

function resetGame() {
    gameSequence = [];
    playerSequence = [];
    level = 0;
    statusDisplay.textContent = 'Get ready...';
    hideExtraBlocks(); // Ocultar blocos extras ao resetar
}

function nextRound() {
    isPlayerTurn = false;
    playerSequence = [];
    level++;
    statusDisplay.textContent = `Level ${level}`;
    unlockExtraBlock(); // Verifica se é hora de desbloquear um novo bloco
    const nextColor = pickRandomColor();
    gameSequence.push(nextColor);
    playSequence();
}

function pickRandomColor() {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
}

function playSequence() {
    let delay = 0;
    gameSequence.forEach((color) => {
        setTimeout(() => {
            flashButton(color);
            playSound(color);
        }, delay);
        delay += 1000;
    });
    setTimeout(() => {
        isPlayerTurn = true;
        statusDisplay.textContent = 'Your turn!';
    }, delay);
}

function flashButton(color) {
    const button = document.getElementById(color);
    button.classList.add('flash');  // Adiciona o brilho
    setTimeout(() => {
        button.classList.remove('flash');  // Remove o brilho após o piscar
    }, 300);
}

function playSound(color) {
    sounds[color].play();
}

colorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (!isPlayerTurn) return;

        const color = e.target.id;
        playerSequence.push(color);
        
        // Faz o botão piscar quando o jogador clica
        flashButton(color);
        
        playSound(color);
        checkPlayerMove();
    });
});

function checkPlayerMove() {
    const currentMove = playerSequence[playerSequence.length - 1];
    const expectedMove = gameSequence[playerSequence.length - 1];

    if (currentMove !== expectedMove) {
        gameOver();
        return;
    }

    if (playerSequence.length === gameSequence.length) {
        setTimeout(nextRound, 1000);
    }
}

function gameOver() {
    isPlayerTurn = false;
    
    if (level > highScore) {
        highScore = level;
        const date = new Date();
        const recordTime = date.toLocaleString();
        saveHighScore(highScore, recordTime);
        statusDisplay.textContent = `New High Score: Level ${highScore}! Record set on: ${recordTime}. Press Start to try again.`;
    } else {
        statusDisplay.textContent = `Game Over! You reached level ${level}. Press Start to try again.`;
    }
    
    playSound('red');
}

function saveHighScore(score, time) {
    localStorage.setItem('simonHighScore', score);
    localStorage.setItem('simonRecordTime', time);
}

function loadHighScore() {
    const savedScore = localStorage.getItem('simonHighScore');
    const savedTime = localStorage.getItem('simonRecordTime');
    if (savedScore && savedTime) {
        highScore = savedScore;
        statusDisplay.textContent = `High Score: Level ${highScore}, set on: ${savedTime}`;
    }
}

// Função para desbloquear um novo bloco a cada 10 níveis
function unlockExtraBlock() {
    if (level === 5) {
        document.getElementById('purple').classList.remove('hidden');
        availableColors.push('purple');
    } else if (level === 15) {
        document.getElementById('orange').classList.remove('hidden');
        availableColors.push('orange');
    } else if (level === 30) {
        document.getElementById('pink').classList.remove('hidden');
        availableColors.push('pink');
    } else if (level === 45) {
        document.getElementById('black').classList.remove('hidden'); 
        availableColors.push('black');
    } else if (level === 60) {
        document.getElementById('SPECIAL').classList.remove('hidden'); 
        availableColors.push('SPECIAL');
    } 
}

// Função para esconder todos os blocos extras ao resetar o jogo
function hideExtraBlocks() {
    document.getElementById('purple').classList.add('hidden');
    document.getElementById('orange').classList.add('hidden');
    document.getElementById('pink').classList.add('hidden');
    document.getElementById('black').classList.add('hidden');
    document.getElementById('SPECIAL').classList.add('hidden');
    
    // Remover os blocos extras da lista de cores
    availableColors = ['green', 'red', 'yellow', 'blue'];
}


