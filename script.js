let streak = 0;
let weeklyProgress = 0;
let lastCompletedDate = "";
let xp = 0;
let level = 1;
let selectedPet = "";
let hunger = 80;
let happiness = 80;
let health = 100;
let score = 0;
let gameInterval;
let focusInterval;
let xpHistory = [];
let quotes = [
    "Success is built daily.",
    "Small habits create big change.",
    "Consistency beats motivation.",
    "Discipline equals freedom."
];
let xpData = [0];
let xpLabels = ["Start"];
let xpChart;

function initChart() {
    const ctx = document.getElementById("xpChart").getContext("2d");

    xpChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: xpLabels,
            datasets: [{
                label: "Pet XP Growth",
                data: xpData,
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function showQuote() {
    let random = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("status").innerText = "💡 " + random;
}

function updateChart() {

    xpHistory.push(xp);
    if (xpHistory.length > 20) xpHistory.shift();

    let canvas = document.getElementById("xpChart");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height - xpHistory[0]);

    xpHistory.forEach((value, index) => {
        ctx.lineTo(index * 15, canvas.height - value);
    });

    ctx.strokeStyle = "blue";
    ctx.stroke();
}

function startFocus() {

    let time = 1500; // 25 minutes

    document.getElementById("status").innerText =
        "Focus Mode Activated 🔒 Stay Concentrated!";

    focusInterval = setInterval(function() {

        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        document.getElementById("focusTimer").innerText =
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        time--;

        if (time < 0) {
            clearInterval(focusInterval);
            xp += 50;
            score += 25;
            document.getElementById("status").innerText =
                "🎉 Focus Completed! Huge XP Reward!";
            updateBars();
        }

    }, 1000);
}
function checkDailyReset() {

    let today = new Date().toDateString();
    let savedDate = localStorage.getItem("lastDate");

    if (savedDate !== today) {

        document.querySelectorAll(".task input").forEach(cb => cb.checked = false);

        localStorage.setItem("lastDate", today);

        if (savedDate) {
            streak++;
        }

        document.getElementById("streak").innerText = streak;
    }
}
function goToSelection() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("selectionScreen").style.display = "block";
}
function choosePet(pet, element) {
    selectedPet = pet;

    document.querySelectorAll(".pet").forEach(p => p.style.border = "none");
    element.style.border = "3px solid green";
}
function addXP(amount) {
    let newXP = xpData[xpData.length - 1] + amount;

    xpData.push(newXP);
    xpLabels.push("XP " + xpData.length);

    xpChart.update();
}
function startGame() {
    showQuote();
    let name = document.getElementById("petName").value;

    if (selectedPet === "" || name === "") {
        document.getElementById("error").innerText = "Select pet and enter name!";
        return;
    }
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("selectionScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    initChart();
    document.getElementById("petTitle").innerText = name;

    if (selectedPet === "dog") {
        document.getElementById("petImage").src = "images/dog.gif";
    } else {
        document.getElementById("petImage").src = "images/cat.gif";
    }

    document.getElementById("bgMusic").play();
    checkDailyReset();
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
    if (level >= 5 && level < 10) {
        document.getElementById("petImage").style.filter = "drop-shadow(0 0 10px gold)";
    }
    
    if (level >= 10) {
        document.getElementById("petImage").style.transform = "scale(1.3)";
    }
    updateChart();
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
function triggerRandomEvent() {

    let events = [
        "🎁 Bonus XP! +20",
        "🌧 Pet feels lonely! Play now!",
        "🎉 Double XP for 10 seconds!"
    ];

    let random = events[Math.floor(Math.random() * events.length)];

    document.getElementById("status").innerText = random;

    if (random.includes("Bonus")) {
        xp += 20;
        score += 10;
    }

    if (random.includes("Double")) {
        xp += 40;
    }

    updateBars();
}
function startAutoDecrease() {
    gameInterval = setInterval(function() {
        if (Math.random() < 0.1) {
            triggerRandomEvent();
        }
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

    }, 4000 - (level * 200));
}
function showSavePopup() {

    let popup = document.getElementById("saveMessage");

    popup.innerText = "💾 Game Saved Successfully!";
    popup.style.opacity = "1";

    setTimeout(() => {
        popup.style.opacity = "0";
    }, 2000);
}
function saveGame() {

    let data = {
        hunger,
        happiness,
        health,
        score,
        level,
        xp,
        streak,
        weeklyProgress,
        selectedPet,
        petName: document.getElementById("petTitle").innerText
    };

    localStorage.setItem("petGame", JSON.stringify(data));

    showSavePopup();
}
function loadGame() {

    let saved = localStorage.getItem("petGame");

    if (saved) {

        let data = JSON.parse(saved);

        hunger = data.hunger || 80;
        happiness = data.happiness || 80;
        health = data.health || 100;
        score = data.score || 0;
        level = data.level || 1;
        xp = data.xp || 0;
        streak = data.streak || 0;
        weeklyProgress = data.weeklyProgress || 0;
        selectedPet = data.selectedPet || "";
        
        if (data.petName) {
            document.getElementById("petTitle").innerText = data.petName;
        }

        document.getElementById("streak").innerText = streak;
        document.getElementById("weeklyProgress").innerText = weeklyProgress;

        updateBars();
    }
}
function restartGame() {
    level = 1;
    checkDailyReset();
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
function completeTask(checkbox, xpValue) {

    if (checkbox.checked) {

        xp += xpValue;
        score += xpValue / 2;

        happiness = Math.min(100, happiness + 5);
        health = Math.min(100, health + 5);

        weeklyProgress++;

        document.getElementById("weeklyProgress").innerText = weeklyProgress;

        document.getElementById("status").innerText =
            "🌟 Amazing! You improved in real life!";

        updateBars();

        saveGame();
    }
}
function saveMood() {

    let mood = document.getElementById("moodSelect").value;

    if (mood === "Sad") {
        alert("Stay strong 💪 Every day is a new opportunity!");
        happiness += 5;
    }

    if (mood === "Happy") {
        happiness += 10;
    }

    updateBars();
}
setInterval(function() {

    if (hunger < 40) {
        alert("💧 Reminder: Drink Water!");
    }

}, 60000);
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}