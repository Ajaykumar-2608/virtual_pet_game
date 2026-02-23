let xp = 0;
let level = 1;
let selectedPet = "";
let hunger = 80;
let happiness = 80;
let health = 100;
let score = 0;
let gameInterval;
function goToSelection() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("selectionScreen").style.display = "block";
}
function choosePet(pet, element) {
    selectedPet = pet;

    document.querySelectorAll(".pet").forEach(p => p.style.border = "none");
    element.style.border = "3px solid green";
}

function startGame() {

    let name = document.getElementById("petName").value;

    if (selectedPet === "" || name === "") {
        document.getElementById("error").innerText = "Select pet and enter name!";
        return;
    }
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("selectionScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

    document.getElementById("petTitle").innerText = name;

    if (selectedPet === "dog") {
        document.getElementById("petImage").src = "images/dog.gif";
    } else {
        document.getElementById("petImage").src = "images/cat.gif";
    }

    document.getElementById("bgMusic").play();

    loadGame();
    updateBars();
    startAutoDecrease();
}

function updateBars() {

    document.getElementById("hungerBar").style.width = hunger + "%";
    document.getElementById("happyBar").style.width = happiness + "%";
    document.getElementById("healthBar").style.width = health + "%";
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;

    let xpPercent = (xp % 50) * 2;
    document.getElementById("xpBar").style.width = xpPercent + "%";

    checkLevel();
    checkBadge();
}
function checkLevel() {

    let newLevel = Math.floor(xp / 50) + 1;

    if (newLevel > level) {
        level = newLevel;

        document.getElementById("level").classList.add("level-up");

        launchConfetti();

        setTimeout(() => {
            document.getElementById("level").classList.remove("level-up");
        }, 1000);
    }
}
function checkBadge() {

    let badgeText = "";

    if (score >= 50 && score < 100) {
        badgeText = "🏅 Beginner Caretaker";
    } 
    else if (score >= 100 && score < 200) {
        badgeText = "🏆 Expert Trainer";
    } 
    else if (score >= 200) {
        badgeText = "👑 Master Pet Owner";
    }

    document.getElementById("badge").innerText = badgeText;
}

function feedPet() {
    hunger = Math.min(100, hunger + 10);
    score += 5;
    xp += 10;
    updateBars();
}

function playPet() {
    happiness = Math.min(100, happiness + 10);
    score += 5;
    xp += 10;
    updateBars();
}

function sleepPet() {
    health = Math.min(100, health + 10);
    score += 5;
    xp += 10;
    updateBars();
}

function startAutoDecrease() {
    gameInterval = setInterval(function() {

        hunger -= 5;
        happiness -= 5;

        if (hunger < 30 || happiness < 30) {
            health -= 5;
        }

        if (health <= 0) {
            health = 0;
            document.getElementById("status").innerText = "💀 Game Over!";
            clearInterval(gameInterval);
        }

        hunger = Math.max(0, hunger);
        happiness = Math.max(0, happiness);

        updateBars();

    }, 4000);
}

function saveGame() {
    let data = { hunger, happiness, health, score, level };
    localStorage.setItem("petGame", JSON.stringify(data));
    alert("Game Saved!");
}

function loadGame() {
    let saved = localStorage.getItem("petGame");

    if (saved) {
        let data = JSON.parse(saved);
        hunger = data.hunger;
        happiness = data.happiness;
        health = data.health;
        score = data.score;
        level = data.level || 1;
    }
}

function restartGame() {
    level = 1;
    clearInterval(gameInterval);
    hunger = 80;
    happiness = 80;
    health = 100;
    score = 0;
    document.getElementById("status").innerText = "";
    updateBars();
    startAutoDecrease();
}
function launchConfetti() {

    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let pieces = [];

    for (let i = 0; i < 100; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 8 + 2,
            speed: Math.random() * 3 + 2
        });
    }

    let animation = setInterval(() => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            ctx.fillStyle = "hsl(" + Math.random()*360 + ",100%,50%)";
            ctx.fillRect(p.x, p.y, p.size, p.size);
            p.y += p.speed;
            if (p.y > canvas.height) p.y = 0;
        });

    }, 30);

    setTimeout(() => {
        clearInterval(animation);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 2000);
}