const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const restartBtn = document.getElementById("restartBtn");

const words = [
    "future", "resume", "builder", "coding", "javascript", "design", "career",
    "speed", "typing", "challenge", "project", "success", "dream", "focus",
    "energy", "create", "learn", "grow", "skill", "logic", "bright", "goal",
    "web", "html", "css", "react", "node", "python", "linux", "cloud", "step",
    "ladder", "climb", "stairs", "move", "jump", "run", "walk", "up", "win"
];

let stairCount = 10;
let stairs = [];
let currentStep = 0;
let currentWord = "";
let score = 0;
let time = 60;
let timerInterval = null;
let gameActive = false;
let charY = 0;

function randomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function setupStairs() {
    stairs = [];
    for (let i = 0; i < stairCount; i++) {
        stairs.push(randomWord());
    }
}

function drawStairs() {
    ctx.save();
    for (let i = 0; i < stairCount; i++) {
        let x = 60 + i * 25;
        let y = canvas.height - 60 - i * 35;
        ctx.fillStyle = "#e0eafc";
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 2;
        ctx.fillRect(x, y, 180, 30);
        ctx.strokeRect(x, y, 180, 30);

        ctx.fillStyle = "#007bff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(stairs[i], x + 90, y + 22);
    }
    ctx.restore();
}

function drawCharacter() {
    let i = currentStep;
    let x = 60 + i * 25 + 30;
    let y = canvas.height - 60 - i * 35 - 30;
    // Draw body
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + 20, y + 10, 12, 0, Math.PI * 2); // head
    ctx.fillStyle = "#ffb347";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 22);
    ctx.lineTo(x + 20, y + 45);
    ctx.stroke();
    // Arms
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 30);
    ctx.lineTo(x + 5, y + 38);
    ctx.moveTo(x + 20, y + 30);
    ctx.lineTo(x + 35, y + 38);
    ctx.stroke();
    // Legs
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 45);
    ctx.lineTo(x + 10, y + 60);
    ctx.moveTo(x + 20, y + 45);
    ctx.lineTo(x + 30, y + 60);
    ctx.stroke();
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStairs();
    drawCharacter();
}

function nextStep() {
    if (currentStep < stairCount - 1) {
        currentStep++;
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        feedback.textContent = "🎉 Great!";
        feedback.style.color = "#28a745";
        wordInput.value = "";
        setTimeout(() => {
            feedback.textContent = "";
        }, 600);
        draw();
        setTimeout(() => {
            wordInput.focus();
        }, 100);
    } else {
        endGame(true);
    }
}

function startGame() {
    setupStairs();
    currentStep = 0;
    score = 0;
    time = 60;
    gameActive = true;
    scoreDisplay.textContent = "Score: 0";
    timerDisplay.textContent = "Time: 60";
    feedback.textContent = "";
    wordInput.value = "";
    wordInput.disabled = false;
    draw();
    wordInput.focus();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time--;
        timerDisplay.textContent = `Time: ${time}`;
        if (time <= 0) {
            endGame(false);
        }
    }, 1000);
    updateWordDisplay();
}

function endGame(won) {
    gameActive = false;
    clearInterval(timerInterval);
    wordInput.disabled = true;
    if (won) {
        feedback.textContent = `🏆 You reached the top! Final Score: ${score}`;
        feedback.style.color = "#007bff";
    } else {
        feedback.textContent = `⏰ Time's up! Final Score: ${score}`;
        feedback.style.color = "#d9534f";
    }
}

function updateWordDisplay() {
    document.getElementById("word-display").textContent = stairs[currentStep];
    document.getElementById("word-display").style.animation = "popWord 0.4s";
    setTimeout(() => {
        document.getElementById("word-display").style.animation = "";
    }, 400);
}

wordInput.addEventListener("input", () => {
    if (!gameActive) return;
    if (wordInput.value.trim() === stairs[currentStep]) {
        nextStep();
        updateWordDisplay();
    }
});

restartBtn.addEventListener("click", startGame);

window.onload = startGame;