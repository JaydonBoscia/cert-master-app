let currentIndex = 0;
let questions = [];
let scoreCorrect = 0;
let scoreWrong = 0;

const categorySelect = document.getElementById("category-select");
const gameSelect = document.getElementById("game-select");
const startBtn = document.getElementById("start-btn");
const questionBox = document.getElementById("question-box");
const answersBox = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const scoreBoard = document.getElementById("score-board");
const scoreCorrectSpan = document.getElementById("score-correct");
const scoreWrongSpan = document.getElementById("score-wrong");

function setUIState(isQuizActive) {
  questionBox.style.display = isQuizActive ? "block" : "none";
  answersBox.style.display = isQuizActive ? "block" : "none";
  nextBtn.style.display = isQuizActive ? "inline-block" : "none";
  scoreBoard.style.display = isQuizActive ? "block" : "none";
}

function updateScoreBoard() {
  scoreCorrectSpan.textContent = `✅ Correct: ${scoreCorrect}`;
  scoreWrongSpan.textContent = `❌ Wrong: ${scoreWrong}`;
}

// Hide all game UIs before starting a new game
function hideAllGames() {
  setUIState(false);
  const flash = document.getElementById('flashcard-container');
  if (flash) flash.style.display = "none";
  const drag = document.getElementById('drag-match-container');
  if (drag) drag.style.display = "none";
}

startBtn.onclick = () => {
  const category = categorySelect.value;
  const game = gameSelect ? gameSelect.value : "quiz";
  if (!category) {
    alert("Please select a category.");
    return;
  }
  if (!game) {
    alert("Please select a game mode.");
    return;
  }
  hideAllGames();

  if (game === "quiz") {
    window.startQuizGame && window.startQuizGame(category);
  } else if (game === "flashcards") {
    window.startFlashcards && window.startFlashcards(category);
  } else if (game === "dragmatch") {
    window.startDragMatch && window.startDragMatch(category);
  }
};

function showQuestion() {
  if (!questions.length) return;
  const q = questions[currentIndex];
  questionBox.innerText = `Q${currentIndex + 1}: ${q.question}`;
  answersBox.innerHTML = "";

  shuffleArray(q.answers).forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.className = "answer-btn";
    btn.onclick = () => {
      if (answer === q.correct) {
        btn.style.background = "#c8e6c9";
        btn.innerText += " ✅";
        scoreCorrect++;
      } else {
        btn.style.background = "#ffcdd2";
        btn.innerText += " ❌";
        scoreWrong++;
      }
      updateScoreBoard();
      // Disable all buttons after answering
      Array.from(answersBox.children).forEach(b => b.disabled = true);
    };
    answersBox.appendChild(btn);
  });
}

nextBtn.onclick = () => {
  if (!questions.length) return;
  currentIndex = (currentIndex + 1) % questions.length;
  showQuestion();
};

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Optionally, populate categorySelect if not static in HTML
// Example:
// categorySelect.innerHTML = `
//   <option value="">Select Category</option>
//   <option value="securityplus">Security+</option>
//   <option value="networkplus">Network+</option>
//   <option value="cloudplus">Cloud+</option>
// `;
