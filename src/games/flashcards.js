// Flashcard game for Cert Master

let flashcards = [];
let flashIndex = 0;

const flashContainer = document.createElement("div");
flashContainer.id = "flashcard-container";
flashContainer.style.display = "none";
flashContainer.style.maxWidth = "500px";
flashContainer.style.margin = "40px auto";
flashContainer.style.padding = "32px";
flashContainer.style.background = "rgba(0,0,0,0.15)";
flashContainer.style.borderRadius = "18px";
flashContainer.style.boxShadow = "0 2px 16px rgba(0,0,0,0.12)";
flashContainer.style.textAlign = "center";

const flashQuestion = document.createElement("div");
flashQuestion.id = "flashcard-question";
flashQuestion.style.fontSize = "1.3em";
flashQuestion.style.marginBottom = "24px";

const flashAnswer = document.createElement("div");
flashAnswer.id = "flashcard-answer";
flashAnswer.style.fontSize = "1.1em";
flashAnswer.style.marginBottom = "24px";
flashAnswer.style.display = "none";

const showAnswerBtn = document.createElement("button");
showAnswerBtn.textContent = "Show Answer";
showAnswerBtn.style.marginRight = "18px";
showAnswerBtn.onclick = () => {
  flashAnswer.style.display = "block";
  showAnswerBtn.style.display = "none";
};

const nextFlashBtn = document.createElement("button");
nextFlashBtn.textContent = "Next Card";
nextFlashBtn.onclick = () => {
  flashIndex = (flashIndex + 1) % flashcards.length;
  renderFlashcard();
};

flashContainer.appendChild(flashQuestion);
flashContainer.appendChild(flashAnswer);
flashContainer.appendChild(showAnswerBtn);
flashContainer.appendChild(nextFlashBtn);

document.body.appendChild(flashContainer);

// Public API to start flashcards
window.startFlashcards = function(category) {
  fetch(`questions/${category}.json`)
    .then(res => res.json())
    .then(data => {
      flashcards = data;
      flashIndex = 0;
      flashContainer.style.display = "block";
      renderFlashcard();
    })
    .catch(err => {
      alert("Could not load flashcards.");
      flashContainer.style.display = "none";
    });
};

function renderFlashcard() {
  if (!flashcards.length) return;
  const card = flashcards[flashIndex];
  flashQuestion.textContent = `Q${flashIndex + 1}: ${card.question}`;
  flashAnswer.textContent = `A: ${card.correct}`;
  flashAnswer.style.display = "none";
  showAnswerBtn.style.display = "inline";
}