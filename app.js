let currentIndex = 0;
let questions = [];

const categorySelect = document.getElementById("category-select");
const startBtn = document.getElementById("start-btn");
const questionBox = document.getElementById("question-box");
const answersBox = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");

function setUIState(isQuizActive) {
  questionBox.style.display = isQuizActive ? "block" : "none";
  answersBox.style.display = isQuizActive ? "block" : "none";
  nextBtn.style.display = isQuizActive ? "inline-block" : "none";
}

startBtn.onclick = () => {
  const category = categorySelect.value;
  if (!category) {
    alert("Please select a category.");
    return;
  }

  fetch(`questions/${category}.json`)
    .then(res => res.json())
    .then(data => {
      questions = shuffleArray(data);
      currentIndex = 0;
      setUIState(true);
      showQuestion();
    })
    .catch(err => {
      console.error("Failed to load questions:", err);
      alert("Could not load questions. Check your console.");
      setUIState(false);
    });
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
      } else {
        btn.style.background = "#ffcdd2";
        btn.innerText += " ❌";
      }
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

// Initialize UI state
setUIState(false);

// Optionally, populate categorySelect if not static in HTML
// Example:
// categorySelect.innerHTML = `
//   <option value="">Select Category</option>
//   <option value="securityplus">Security+</option>
//   <option value=
