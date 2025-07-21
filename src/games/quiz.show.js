// Sample game logic with score and fun feedback
let quizIndex = 0;
let quizScore = 0;
let quizQuestions = [];
const quizBox = document.getElementById("quiz-game");

const quizQ = document.getElementById("quiz-question");
const quizA = document.getElementById("quiz-answers");
const quizNext = document.getElementById("quiz-next");
const quizFeedback = document.getElementById("quiz-feedback");
const quizScoreDisplay = document.getElementById("quiz-score");

// Load questions from CCNA JSON as default
fetch("questions/ccna.json")
  .then(res => res.json())
  .then(data => {
    quizQuestions = shuffleArray(data);
    quizBox.style.display = "block";
    showQuizQ();
  });

function showQuizQ() {
  const q = quizQuestions[quizIndex];
  quizQ.innerText = q.question;
  quizA.innerHTML = "";
  quizFeedback.innerText = "";

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => {
      if (answer === q.correct) {
        quizScore += 10;
        quizFeedback.innerText = "✅ Correct! +10 points";
      } else {
        quizFeedback.innerText = "❌ Nope! Try again next time.";
      }
      quizScoreDisplay.innerText = quizScore;
      disableAnswers();
    };
    quizA.appendChild(btn);
  });
}

function disableAnswers() {
  const buttons = quizA.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);
}

quizNext.onclick = () => {
  quizIndex = (quizIndex + 1) % quizQuestions.length;
  showQuizQ();
};

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
