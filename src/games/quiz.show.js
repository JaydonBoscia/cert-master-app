// Quiz Game Module for Cert Master

let quizIndex = 0;
let quizScore = 0;
let quizQuestions = [];
let quizCategory = "ccna"; // default, will be set by startQuizGame

// Dynamically create quiz UI if not present
function ensureQuizUI() {
    let quizBox = document.getElementById("quiz-game");
    if (!quizBox) {
        quizBox = document.createElement("div");
        quizBox.id = "quiz-game";
        quizBox.style.display = "none";
        quizBox.style.maxWidth = "600px";
        quizBox.style.margin = "40px auto";
        quizBox.style.padding = "32px";
        quizBox.style.background = "rgba(0,0,0,0.15)";
        quizBox.style.borderRadius = "18px";
        quizBox.style.boxShadow = "0 2px 16px rgba(0,0,0,0.12)";
        quizBox.style.textAlign = "center";
        quizBox.innerHTML = `
            <div id="quiz-progress"></div>
            <div id="quiz-question" style="font-size:1.3em;margin:24px 0;"></div>
            <div id="quiz-answers" style="margin-bottom:24px;"></div>
            <div id="quiz-feedback" style="margin-bottom:18px;"></div>
            <div id="quiz-score" style="font-weight:bold;">0</div>
            <button id="quiz-next" style="display:inline-block;">Next</button>
        `;
        document.body.appendChild(quizBox);
    }
    return quizBox;
}

// Public API to start quiz game
window.startQuizGame = function(category) {
    quizCategory = category || "ccna";
    quizIndex = 0;
    quizScore = 0;
    const quizBox = ensureQuizUI();
    quizBox.style.display = "block";
    // Hide other game UIs if present
    const flash = document.getElementById('flashcard-container');
    if (flash) flash.style.display = "none";
    const drag = document.getElementById('drag-match-container');
    if (drag) drag.style.display = "none";
    const scoreBoard = document.getElementById('score-board');
    if (scoreBoard) scoreBoard.style.display = "none";
    const questionBox = document.getElementById('question-box');
    if (questionBox) questionBox.style.display = "none";
    const answersBox = document.getElementById('answers');
    if (answersBox) answersBox.style.display = "none";
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = "none";

    fetch(`questions/${quizCategory}.json`)
        .then(res => res.json())
        .then(data => {
            quizQuestions = shuffleArray(data);
            showQuizQ();
        })
        .catch(() => {
            quizBox.style.display = "none";
            alert("Could not load quiz questions.");
        });
};

function showQuizQ() {
    const quizBox = ensureQuizUI();
    const quizQ = document.getElementById("quiz-question");
    const quizA = document.getElementById("quiz-answers");
    const quizNext = document.getElementById("quiz-next");
    const quizFeedback = document.getElementById("quiz-feedback");
    const quizScoreDisplay = document.getElementById("quiz-score");
    const quizProgress = document.getElementById("quiz-progress");

    const q = quizQuestions[quizIndex];
    quizQ.innerText = q.question;
    quizA.innerHTML = "";
    quizFeedback.innerText = "";
    quizNext.disabled = true;
    quizNext.innerText = quizIndex === quizQuestions.length - 1 ? "Finish" : "Next";
    quizProgress.innerText = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
    quizScoreDisplay.innerText = quizScore;

    // Shuffle answers for each question
    const shuffledAnswers = shuffleArray(q.answers);

    shuffledAnswers.forEach(answer => {
        const btn = document.createElement("button");
        btn.innerText = answer;
        btn.className = "answer-btn";
        btn.onclick = () => {
            if (answer === q.correct) {
                quizScore += 10;
                quizFeedback.innerText = "✅ Correct! +10 points";
                btn.style.background = "#4caf50";
            } else {
                quizFeedback.innerText = "❌ Nope! Try again next time.";
                btn.style.background = "#f44336";
            }
            quizScoreDisplay.innerText = quizScore;
            disableAnswers(q.correct);
            quizNext.disabled = false;
        };
        quizA.appendChild(btn);
    });

    quizNext.onclick = () => {
        quizIndex++;
        if (quizIndex >= quizQuestions.length) {
            showFinalScore();
        } else {
            showQuizQ();
        }
    };
}

function disableAnswers(correct) {
    const quizA = document.getElementById("quiz-answers");
    const buttons = quizA.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === correct) {
            btn.style.border = "2px solid #4caf50";
        }
    });
}

function showFinalScore() {
    const quizQ = document.getElementById("quiz-question");
    const quizA = document.getElementById("quiz-answers");
    const quizFeedback = document.getElementById("quiz-feedback");
    const quizNext = document.getElementById("quiz-next");
    const quizScoreDisplay = document.getElementById("quiz-score");
    const quizProgress = document.getElementById("quiz-progress");

    quizQ.innerText = "Quiz Complete!";
    quizA.innerHTML = "";
    quizFeedback.innerText = `Your final score: ${quizScore}`;
    quizScoreDisplay.innerText = quizScore;
    quizProgress.innerText = "";
    quizNext.innerText = "Restart";
    quizNext.disabled = false;
    quizNext.onclick = () => window.startQuizGame(quizCategory);
}

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}
