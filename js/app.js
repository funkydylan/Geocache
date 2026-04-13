const KLUIS_CODE = "Blackie1994";

// Mini-game constants
const NUM_ROUNDS = 4; // Aantal succesvolle hits nodig
const INITIAL_SAFE_ZONE_SIZE = Math.PI * 0.5; // Initiële grootte van de safe zone (90 graden)
const SAFE_ZONE_SHRINK_FACTOR = 0.7; // Factor waarmee de safe zone krimpt na elke succesvolle ronde
const BAR_SPEED = 0.05; // radians per frame

// Mini-game state
let currentRound = 0;
let barAngle = 0; // Current angle of the bar in radians
let animationFrameId; // To store the requestAnimationFrame ID
let gameActive = false; // Geeft aan of het spel actief is

// Safe zone state (nu variabel)
let safeZoneStartAngle, safeZoneEndAngle, currentSafeZoneSize;

// Canvas elements
let canvas, ctx;
let gameInstructions;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas and context for the mini-game
    canvas = document.getElementById('minigameCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        gameInstructions = document.getElementById('game-instructions');
        startGame(); // Start the game animation immediately
    }

    // Event listeners for buttons
    document.getElementById('loginButton')?.addEventListener('click', handleGameAction); // This button now handles the game
    document.getElementById('backToRootButton')?.addEventListener('click', showDashboard);
    document.getElementById('kluisButton')?.addEventListener('click', checkKluis);
});

function startGame() {
    currentRound = 0;
    barAngle = 0;
    currentSafeZoneSize = INITIAL_SAFE_ZONE_SIZE; // Initialiseer safe zone grootte
    gameActive = true;
    setNewSafeZonePosition(); // Stel de initiële willekeurige safe zone positie in
    updateInstructions();
    animateGame();
}

function animateGame() {
    if (!gameActive) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update bar angle
    barAngle = (barAngle + BAR_SPEED) % (Math.PI * 2); // Keep angle between 0 and 2*PI

    drawGame();

    animationFrameId = requestAnimationFrame(animateGame);
}

function drawGame() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#c0d0d6'; // Light gray
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw safe zone
    // Gebruik de variabele safeZoneStartAngle en safeZoneEndAngle
    ctx.beginPath();
    // Controleer of de safe zone over de 0/2PI grens heen loopt
    if (safeZoneStartAngle > safeZoneEndAngle) {
        // Teken het eerste deel van de safe zone (tot 2*PI)
        ctx.arc(centerX, centerY, radius, safeZoneStartAngle, Math.PI * 2);
        ctx.stroke();
        // Teken het tweede deel van de safe zone (vanaf 0)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, safeZoneEndAngle);
    } else {
        // Teken de safe zone normaal
        ctx.arc(centerX, centerY, radius, safeZoneStartAngle, safeZoneEndAngle);
    }
    
    ctx.strokeStyle = '#8bc34a'; // Greenish
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw rotating bar
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(barAngle), centerY + radius * Math.sin(barAngle));
    ctx.strokeStyle = '#4a69bd'; // Blue
    ctx.lineWidth = 5;
    ctx.stroke();
}

// Functie om een nieuwe willekeurige positie voor de safe zone in te stellen
function setNewSafeZonePosition() {
    // Genereer een willekeurige start hoek voor de safe zone
    safeZoneStartAngle = Math.random() * Math.PI * 2;
    // Bereken de eindhoek, zorg ervoor dat deze correct over 2*PI heen wikkelt
    safeZoneEndAngle = (safeZoneStartAngle + currentSafeZoneSize) % (Math.PI * 2);
}

function handleGameAction() {
    if (!gameActive) return;

    // Check if the bar is in the safe zone
    let inSafeZone = false;
    if (safeZoneStartAngle > safeZoneEndAngle) { // Safe zone wraps around 0/2PI
        inSafeZone = (barAngle >= safeZoneStartAngle && barAngle <= Math.PI * 2) ||
                     (barAngle >= 0 && barAngle <= safeZoneEndAngle);
    } else {
        inSafeZone = (barAngle >= safeZoneStartAngle && barAngle <= safeZoneEndAngle);
    }

    if (inSafeZone) {
        currentRound++;
        if (currentRound === NUM_ROUNDS) {
            gameInstructions.textContent = "Gefeliciteerd! Toegang verleend!";
            gameActive = false;
            cancelAnimationFrame(animationFrameId);
            setTimeout(() => {
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('dashboard').classList.remove('hidden');
            }, 1500); // Wait a bit before transitioning
        } else {
            // Verklein de safe zone
            currentSafeZoneSize *= SAFE_ZONE_SHRINK_FACTOR;
            // Stel een nieuwe willekeurige positie in voor de safe zone
            setNewSafeZonePosition();
            updateInstructions();
            // Optionally, reset bar position or speed up for next round
            // barAngle = 0; // Reset bar for next round
        }
    } else {
        currentRound = 0; // Reset if missed
        currentSafeZoneSize = INITIAL_SAFE_ZONE_SIZE; // Reset safe zone grootte
        setNewSafeZonePosition(); // Stel een nieuwe willekeurige positie in
        gameInstructions.textContent = "Mis! Probeer opnieuw. (Ronde 1 van " + NUM_ROUNDS + ")"; // Update instructies
    }
}

function updateInstructions() {
    gameInstructions.textContent = `Druk op de knop wanneer de balk in de groene zone is. (Ronde ${currentRound + 1} van ${NUM_ROUNDS})`;
}

// Existing functions
async function loadContent(url) {
    const response = await fetch(url);
    const text = await response.text();
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('content-viewer').classList.remove('hidden');
    document.getElementById('content-area').innerHTML = text;
}

function showDashboard() {
    document.getElementById('content-viewer').classList.add('hidden');
    document.getElementById('kluis-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

function openKluis() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('kluis-screen').classList.remove('hidden');
}

function checkKluis() {
    const val = document.getElementById('pass2').value;
    if(val === KLUIS_CODE) {
        document.getElementById('kluis-screen').innerHTML = `
            <h2>TOEGANG VERLEEND</h2>
            <p>COORDINATEN:</p>
            <h1>N 51° 12.345<br>E 003° 54.321</h1>
        `;
    } else {
        alert("CODE ONJUIST");
    }
}
