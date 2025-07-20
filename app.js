let currentIndex = 0;
const questions = [
  {
    question: "What port does HTTPS use?",
    answers: ["80", "22", "443", "25"],
    correct: "443"
  },
  {
    question: "Which layer is responsible for routing?",
    answers: ["Data Link", "Transport", "Network", "Application"],
    correct: "Network"
  }
];

function showQuestion() {
  const q = questions[currentIndex];
  document.getElementById("question-box").innerText = q.question;
  const answersBox = document.getElementById("answers");
  answersBox.innerHTML = "";
  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => {
      if (answer === q.correct) {
        alert("✅ Correct!");
      } else {
        alert("❌ Try again!");
      }
    };
    answersBox.appendChild(btn);
  });
}

document.getElementById("next-btn").onclick = () => {
  currentIndex = (currentIndex + 1) % questions.length;
  showQuestion();
};

showQuestion();
