const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const backgroundImage = new Image();
backgroundImage.src = 'bbbh4.jpg'; // Background image

const characterImage = new Image();
characterImage.src = 'https://raw.githubusercontent.com/brengy/car/main/WhatsApp_Image_2024-02-29_at_10.14.55_PM-removebg-preview.png'; // Character image

const coinImage = new Image();
coinImage.src = 'coin.png'; // Coin image

let character = {
    x: canvas.width / 2,
    y: 0, // Initial y position will be updated in initializeCharacter()
    width: 50,
    height: 50,
    speed: 5,
    velocityY: 0,
    gravity: 0.5,
    jumpStrength: -10,
    onGround: false
};

let platforms = [
    { x: 100, y: 500, width: 150, height: 10 },
    { x: 300, y: 400, width: 150, height: 10 },
    { x: 500, y: 300, width: 150, height: 10 },
    { x: 200, y: 200, width: 150, height: 10 }
];

let coins = [
    { x: 120, y: 460 },
    { x: 320, y: 360 },
    { x: 520, y: 260 },
    { x: 220, y: 160 }
];

let cameraOffsetY = 0;
let keys = {};

// Event listeners for key inputs
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    console.log(`Key down: ${e.key}`); // Debug log
});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
    console.log(`Key up: ${e.key}`); // Debug log
});

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, -cameraOffsetY, canvas.width, canvas.height + cameraOffsetY);
}

function drawCharacter() {
    ctx.drawImage(characterImage, character.x, character.y - cameraOffsetY, character.width, character.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'brown';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y - cameraOffsetY, platform.width, platform.height);
    });
}

function drawCoins() {
    coins.forEach(coin => {
        ctx.drawImage(coinImage, coin.x, coin.y - cameraOffsetY, 30, 30);
    });
}

function handleInput() {
    if (keys['ArrowLeft']) character.x -= character.speed;
    if (keys['ArrowRight']) character.x += character.speed;
    if (keys['ArrowUp'] && character.onGround) {
        console.log('Jumping!'); // Debug log
        character.velocityY = character.jumpStrength;
        character.onGround = false; // Character jumps, no longer on ground
    }
}

function applyPhysics() {
    character.velocityY += character.gravity;
    character.y += character.velocityY;

    // Check collision with platforms
    let wasOnGround = character.onGround; // Store previous ground state
    character.onGround = false; // Assume character is not on ground

    platforms.forEach(platform => {
        if (
            character.y + character.height > platform.y - cameraOffsetY &&
            character.y + character.height < platform.y - cameraOffsetY + platform.height &&
            character.x + character.width > platform.x &&
            character.x < platform.x + platform.width &&
            character.velocityY >= 0
        ) {
            character.y = platform.y - cameraOffsetY - character.height;
            character.velocityY = 0;
            character.onGround = true; // Character is on a platform
        }
    });

    // Debugging logs
    console.log(`Character y: ${character.y}, velocityY: ${character.velocityY}, onGround: ${character.onGround}`);

    // Prevent character from falling through the bottom of the screen
    if (character.y - cameraOffsetY > canvas.height) {
        character.y = canvas.height - 100;
        cameraOffsetY = 0; // Reset camera position
    }

    // Move camera upwards if needed
    if (character.y - cameraOffsetY < canvas.height / 2) {
        cameraOffsetY += character.speed;
    }
}

function initializeCharacter() {
    // Start character on the first platform
    const firstPlatform = platforms[0];
    character.x = firstPlatform.x + (firstPlatform.width - character.width) / 2;
    character.y = firstPlatform.y - character.height; // Place character on top of the first platform
    character.velocityY = 0;
    character.onGround = true;

    // Debug log
    console.log(`Character initialized at: ${character.x}, ${character.y}`);
}

function update() {
    handleInput();
    applyPhysics();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawCharacter();
    requestAnimationFrame(update);
}

// Start game when the background image is loaded
backgroundImage.onload = () => {
    initializeCharacter(); // Ensure character starts on the first platform
    update();
};
