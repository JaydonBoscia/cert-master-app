// Drag and Match game for Cert Master

let dragData = [];
let dragPairs = [];
let dragScore = 0;

const dragContainer = document.createElement("div");
dragContainer.id = "drag-match-container";
dragContainer.style.display = "none";
dragContainer.style.maxWidth = "700px";
dragContainer.style.margin = "40px auto";
dragContainer.style.padding = "32px";
dragContainer.style.background = "rgba(0,0,0,0.13)";
dragContainer.style.borderRadius = "18px";
dragContainer.style.boxShadow = "0 2px 16px rgba(0,0,0,0.10)";
dragContainer.style.textAlign = "center";

const dragTitle = document.createElement("div");
dragTitle.textContent = "🧩 Drag & Match: Match the Question to the Correct Answer";
dragTitle.style.fontSize = "1.2em";
dragTitle.style.marginBottom = "24px";

const dragScoreBox = document.createElement("div");
dragScoreBox.id = "drag-match-score";
dragScoreBox.style.marginBottom = "18px";
dragScoreBox.style.fontWeight = "bold";
dragScoreBox.textContent = "Score: 0";

const dragQuestions = document.createElement("div");
dragQuestions.id = "drag-questions";
dragQuestions.style.display = "inline-block";
dragQuestions.style.verticalAlign = "top";
dragQuestions.style.width = "45%";
dragQuestions.style.minHeight = "200px";
dragQuestions.style.marginRight = "5%";

const dragAnswers = document.createElement("div");
dragAnswers.id = "drag-answers";
dragAnswers.style.display = "inline-block";
dragAnswers.style.verticalAlign = "top";
dragAnswers.style.width = "45%";
dragAnswers.style.minHeight = "200px";

const dragResetBtn = document.createElement("button");
dragResetBtn.textContent = "Restart";
dragResetBtn.style.marginTop = "24px";
dragResetBtn.onclick = () => {
  renderDragMatch();
};

dragContainer.appendChild(dragTitle);
dragContainer.appendChild(dragScoreBox);
dragContainer.appendChild(dragQuestions);
dragContainer.appendChild(dragAnswers);
dragContainer.appendChild(dragResetBtn);

document.body.appendChild(dragContainer);

// Public API to start drag-match
window.startDragMatch = function(category) {
  fetch(`questions/${category}.json`)
    .then(res => res.json())
    .then(data => {
      dragData = data;
      dragScore = 0;
      dragContainer.style.display = "block";
      // Hide other game UIs if present
      const quizBox = document.getElementById('question-box');
      const quizAns = document.getElementById('answers');
      const quizNext = document.getElementById('next-btn');
      const scoreBoard = document.getElementById('score-board');
      if (quizBox) quizBox.style.display = "none";
      if (quizAns) quizAns.style.display = "none";
      if (quizNext) quizNext.style.display = "none";
      if (scoreBoard) scoreBoard.style.display = "none";
      renderDragMatch();
    })
    .catch(err => {
      alert("Could not load drag & match game.");
      dragContainer.style.display = "none";
    });
};

function renderDragMatch() {
  dragScore = 0;
  dragScoreBox.textContent = "Score: 0";
  dragQuestions.innerHTML = "";
  dragAnswers.innerHTML = "";

  // Prepare pairs and shuffle
  dragPairs = dragData
    .slice(0, Math.min(6, dragData.length)) // Show up to 6 pairs at a time for clarity
    .map(q => ({ question: q.question, answer: q.correct }));

  const shuffledQuestions = shuffleArray(dragPairs.map(p => p.question));
  const shuffledAnswers = shuffleArray(dragPairs.map(p => p.answer));

  // Render questions as draggable items
  shuffledQuestions.forEach((qText) => {
    const qDiv = document.createElement("div");
    qDiv.className = "drag-question";
    qDiv.textContent = qText;
    qDiv.draggable = true;
    qDiv.style.padding = "12px";
    qDiv.style.margin = "12px";
    qDiv.style.background = "#232526";
    qDiv.style.border = "2px solid #00c6ff";
    qDiv.style.borderRadius = "8px";
    qDiv.style.cursor = "grab";
    qDiv.style.userSelect = "none";
    qDiv.ondragstart = e => {
      e.dataTransfer.setData("text/plain", qText);
      setTimeout(() => qDiv.style.opacity = "0.5", 0);
    };
    qDiv.ondragend = () => {
      qDiv.style.opacity = "1";
    };
    dragQuestions.appendChild(qDiv);
  });

  // Render answers as drop targets
  shuffledAnswers.forEach((aText) => {
    const aDiv = document.createElement("div");
    aDiv.className = "drag-answer";
    aDiv.textContent = aText;
    aDiv.style.padding = "12px";
    aDiv.style.margin = "12px";
    aDiv.style.background = "#fff";
    aDiv.style.color = "#232526";
    aDiv.style.border = "2px dashed #00c6ff";
    aDiv.style.borderRadius = "8px";
    aDiv.style.minHeight = "40px";
    aDiv.style.transition = "background 0.2s";
    aDiv.ondragover = e => {
      e.preventDefault();
      aDiv.style.background = "#e0f7fa";
    };
    aDiv.ondragleave = () => {
      aDiv.style.background = "#fff";
    };
    aDiv.ondrop = e => {
      e.preventDefault();
      aDiv.style.background = "#fff";
      const draggedQ = e.dataTransfer.getData("text/plain");
      const correctPair = dragPairs.find(p => p.question === draggedQ && p.answer === aText);
      if (correctPair) {
        aDiv.style.background = "#c8e6c9";
        aDiv.textContent = `✅ ${aText}`;
        dragScore++;
        dragScoreBox.textContent = `Score: ${dragScore}`;
        // Remove matched question
        Array.from(dragQuestions.children).forEach(qEl => {
          if (qEl.textContent === draggedQ) qEl.style.display = "none";
        });
        aDiv.ondrop = null;
        aDiv.ondragover = null;
        aDiv.ondragleave = null;
        if (dragScore === dragPairs.length) {
          setTimeout(() => {
            alert("🎉 All matches correct! Try again or switch category.");
          }, 300);
        }
      } else {
        aDiv.style.background = "#ffcdd2";
        setTimeout(() => { aDiv.style.background = "#fff"; }, 600);
      }
    };
    dragAnswers.appendChild(aDiv);
  });
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}