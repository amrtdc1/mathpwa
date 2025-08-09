let selectedOperation = null;
let problemSettings = {};
let currentProblemIndex = 0;
let problems = [];
let userAnswer = "";
let correctCount = 0;

// Show the initial view
document.addEventListener('DOMContentLoaded', () => {
  showView('home');
});

// View switching
function showView(viewId) {
  const views = document.querySelectorAll('.view');
  views.forEach(view => view.style.display = 'none');
  document.getElementById(viewId).style.display = 'block';
}

// Operation selection
function selectOperation(op) {
  selectedOperation = op;
  showView('options');
}

// Start problem session
function startProblems() {
  const firstMin = parseInt(document.getElementById('firstMin').value);
  const firstMax = parseInt(document.getElementById('firstMax').value);
  const secondMin = parseInt(document.getElementById('secondMin').value);
  const secondMax = parseInt(document.getElementById('secondMax').value);
  const numProblems = parseInt(document.getElementById('numProblems').value);

  if (isNaN(firstMin) || isNaN(firstMax) || isNaN(secondMin) || isNaN(secondMax) || isNaN(numProblems)) {
    alert("Please fill out all fields with valid numbers.");
    return;
  }

  problemSettings = {
    operation: selectedOperation,
    firstMin,
    firstMax,
    secondMin,
    secondMax,
    numProblems
  };

  generateProblems();
  showView('problems');
}

// Return to home
function goHome() {
  showView('home');
}

// Generate problems
function generateProblems() {
  problems = [];
  currentProblemIndex = 0;
  correctCount = 0;

  const { operation, firstMin, firstMax, secondMin, secondMax, numProblems } = problemSettings;

  for (let i = 0; i < numProblems; i++) {
    const a = getRandomInt(firstMin, firstMax);
    const b = getRandomInt(secondMin, secondMax);
    let answer;

    switch (operation) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '*': answer = a * b; break;
      case '/': answer = parseFloat((a / b).toFixed(2)); break;
    }

    problems.push({ a, b, answer });
  }

  showProblem();
}

// Display current problem
function showProblem() {
  const problem = problems[currentProblemIndex];
  document.getElementById('problemDisplay').textContent = `${problem.a} ${problemSettings.operation} ${problem.b} =`;
  userAnswer = "";
  document.getElementById('answerInput').textContent = "_";
  document.getElementById('feedbackBanner').style.display = 'none';
}

// Handle number input
function pressNum(num) {
  userAnswer += num.toString();
  document.getElementById('answerInput').textContent = userAnswer;
}

// Handle decimal input
function pressDecimal() {
  if (!userAnswer.includes('.')) {
    userAnswer += '.';
    document.getElementById('answerInput').textContent = userAnswer;
  }
}

// Handle negative input
function pressNeg() {
  if (!userAnswer.includes('-')) {
    userAnswer += '-';
    document.getElementById('answerInput').textContent = userAnswer;
  }
}

// Clear input
function clearAnswer() {
  userAnswer = "";
  document.getElementById('answerInput').textContent = "_";
}

// Submit answer
function submitAnswer() {
  const correct = problems[currentProblemIndex].answer;
  const userValue = problemSettings.operation === '/' ? parseFloat(userAnswer) : parseInt(userAnswer);
  const feedbackBanner = document.getElementById('feedbackBanner');

  if (userAnswer === "") {
    feedbackBanner.textContent = "⚠️ Please enter an answer.";
  } else if (userValue === correct) {
    feedbackBanner.textContent = "✅ Correct!";
    correctCount++;
  } else {
    feedbackBanner.textContent = `❌ Nope! It was ${correct}`;
  }

  feedbackBanner.style.display = 'block';

  setTimeout(() => {
    feedbackBanner.style.display = 'none';
    currentProblemIndex++;

    if (currentProblemIndex < problems.length) {
      showProblem();
    } else {
      showScore();
    }
  }, 1500);
}

// Show final score
function showScore() {
  const percent = Math.round((correctCount / problems.length) * 100);
  document.getElementById('scoreSummary').textContent =
    `You got ${correctCount} out of ${problems.length} correct (${percent}%)!`;
  showView('score');
}

// Random number helper
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');

  const toggleBtn = document.getElementById('darkModeToggle');
  if (document.body.classList.contains('dark-mode')) {
    toggleBtn.textContent = '☀ Light Mode';
  } else {
    toggleBtn.textContent = '☾ Dark Mode';
  }
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("Service Worker registration failed:", err));
}
