const GRID_SIZE = 12;
const TILES_PER_REVEAL = 8;

// ---------- DAILY PUZZLE SELECTION ----------

function getDayIndex() {
    const start = new Date("2025-01-01");
    const today = new Date();

    const diffTime = today - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getTodayArtwork() {
    const index = getDayIndex() % ARTWORKS.length;
    return ARTWORKS[index];
}

// ---------- STATE ----------

let artwork = getTodayArtwork();
let tiles = [];
let revealedCount = 0;
let solved = false;

// ---------- DOM ELEMENTS ----------

const img = document.getElementById("artImage");
const overlay = document.getElementById("tileOverlay");
const input = document.getElementById("guessInput");
const button = document.getElementById("guessButton");
const message = document.getElementById("message");

const answerBox = document.getElementById("answerBox");
const titleText = document.getElementById("titleText");
const artistText = document.getElementById("artistText");
const revealButton = document.getElementById("revealButton");

// stats
const gamesPlayedEl = document.getElementById("gamesPlayed");
const gamesWonEl = document.getElementById("gamesWon");
const currentStreakEl = document.getElementById("currentStreak");
const bestStreakEl = document.getElementById("bestStreak");

// ---------- INIT ----------

function init() {
    img.src = artwork.image;

    setupTiles();
    loadStats();
    updateStatsUI();

    revealButton.addEventListener("click", revealAnswer);
    button.addEventListener("click", handleGuess);

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleGuess();
    });
}

// ---------- TILE SYSTEM ----------

function setupTiles() {
    overlay.innerHTML = "";
    overlay.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    overlay.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

    tiles = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");

        tile.style.background = "#f4f1eb";
        tile.style.transition = "opacity 0.3s ease";

        overlay.appendChild(tile);
        tiles.push(tile);
    }

    // reveal a small starting area
    revealTiles(10);
}

function revealTiles(count) {
    let hiddenTiles = tiles.filter(t => t.style.opacity !== "0");

    for (let i = 0; i < count && hiddenTiles.length > 0; i++) {
        const index = Math.floor(Math.random() * hiddenTiles.length);
        const tile = hiddenTiles[index];

        tile.style.opacity = "0";

        hiddenTiles.splice(index, 1);
    }
}

// ---------- GAME LOGIC ----------

function handleGuess() {
    if (solved) return;

    const guess = input.value.trim().toLowerCase();
    input.value = "";

    if (!guess) return;

    const correctTitle = artwork.title.toLowerCase();

    if (guess === correctTitle) {
        winGame();
    } else {
        message.textContent = "Not quite... more revealed!";
        revealTiles(TILES_PER_REVEAL);
        updateStats(false);
    }
}

function winGame() {
    solved = true;

    message.textContent = "🎉 Correct!";
    answerBox.classList.remove("hidden");

    titleText.textContent = artwork.title;
    artistText.textContent = artwork.artist;

    revealAllTiles();

    updateStats(true);
}

// ---------- REVEAL ----------

function revealAllTiles() {
    tiles.forEach(t => t.style.opacity = "0");
}

function revealAnswer() {
    winGame();
}

// ---------- STATS ----------

function loadStats() {
    if (!localStorage.getItem("artStats")) {
        localStorage.setItem("artStats", JSON.stringify({
            played: 0,
            won: 0,
            streak: 0,
            bestStreak: 0,
            lastDay: -1
        }));
    }
}

function getStats() {
    return JSON.parse(localStorage.getItem("artStats"));
}

function saveStats(stats) {
    localStorage.setItem("artStats", JSON.stringify(stats));
}

function updateStats(won) {
    const stats = getStats();
    const today = getDayIndex();

    if (stats.lastDay === today) return;

    stats.played += 1;
    stats.lastDay = today;

    if (won) {
        stats.won += 1;
        stats.streak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
    } else {
        stats.streak = 0;
    }

    saveStats(stats);
    updateStatsUI();
}

function updateStatsUI() {
    const stats = getStats();

    gamesPlayedEl.textContent = stats.played;
    gamesWonEl.textContent = stats.won;
    currentStreakEl.textContent = stats.streak;
    bestStreakEl.textContent = stats.bestStreak;
}

// ---------- START GAME ----------

init();
