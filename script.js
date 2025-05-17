let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let gameActive = true;
let moveCount = 0;
let playerXWins = 0;
let playerOWins = 0;
let aiWins = 0;


const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const xWinsElement = document.getElementById('x-wins');
const oWinsElement = document.getElementById('o-wins');
const moveCountElement = document.getElementById('move-count');
const moveSound = document.getElementById('move-sound');
const winSound = document.getElementById('win-sound');
const drawSound = document.getElementById('draw-sound');

const modeSelect = document.getElementById('mode');

cells.forEach(cell => cell.addEventListener('click', handleClick));

function handleClick(event) {
  const cell = event.target;
  const index = cell.getAttribute('data-index');

  if (boardState[index] || !gameActive) return;

  moveSound.play();
  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  moveCount++;
  moveCountElement.textContent = moveCount;

  if (checkWinner()) {
    endGame(false);
  } else if (boardState.every(cell => cell)) {
    endGame(true);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    messageElement.textContent = `Player ${currentPlayer}'s Turn`;

    if (currentPlayer === 'O' && modeSelect.value === 'ai') {
      setTimeout(makeAIMove, 500);
    }
  }
}

function makeAIMove() {
  let bestScore = -Infinity;
  let bestMove;

  boardState.forEach((cell, index) => {
    if (cell === null) {
      boardState[index] = 'O';
      let score = minimax(boardState, 0, false);
      boardState[index] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  });

  boardState[bestMove] = 'O';
  cells[bestMove].textContent = 'O';
  moveCount++;
  moveCountElement.textContent = moveCount;

  if (checkWinner()) {
    endGame(false);
  } else if (boardState.every(cell => cell)) {
    endGame(true);
  } else {
    currentPlayer = 'X';
    messageElement.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function minimax(board, depth, isMaximizing) {
  let winner = checkWinner();
  if (winner) return winner === 'O' ? 10 : -10;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((cell, index) => {
      if (cell === null) {
        board[index] = 'O';
        let score = minimax(board, depth + 1, false);
        board[index] = null;
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((cell, index) => {
      if (cell === null) {
        board[index] = 'X';
        let score = minimax(board, depth + 1, true);
        board[index] = null;
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function checkWinner() {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }
  return null;
}

function endGame(draw) {
  gameActive = false;
  if (draw) {
    drawSound.play();
    messageElement.textContent = "It's a draw!";
  } else {
    winSound.play();
    messageElement.textContent = `Player ${currentPlayer} wins!`;
    if (currentPlayer === 'X') {
      playerXWins++;
      xWinsElement.textContent = playerXWins;
    } else {
      playerOWins++;
      oWinsElement.textContent = playerOWins;
      if (modeSelect.value === 'ai') {
        aiWins++;
        if (aiWins === 3) {
          showChallengeMessage();
        }
      }
    }
  }
}

function showChallengeMessage() {
  document.getElementById('challenge-popup').style.display = 'block';
}

function closeChallenge() {
    const popup = document.getElementById('challenge-popup');
    popup.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
        popup.style.display = 'none';
        popup.style.animation = ''; // Reset for next time
    }, 300);
}


function resetGame() {
  boardState.fill(null);
  cells.forEach(cell => cell.textContent = '');
  moveCount = 0;
  moveCountElement.textContent = moveCount;
  gameActive = true;
  currentPlayer = 'X';
  messageElement.textContent = "Player X's Turn";
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
}
