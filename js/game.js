/**
 * Game code
 * @author AlexEtienne, ArseneBrosy
 * @since 2024-10-04
 */

//#region Constants

// Get the canvas and its 2d context
const CANVAS = document.querySelector("#game canvas");
const CTX = CANVAS.getContext("2d");

// Set the size of the canvas
CANVAS.width = 1920;
CANVAS.height = 880;

// Sprites
const PLAYER_LEFT = new Image();
PLAYER_LEFT.src = "img/player-left.png";
const PLAYER_RIGHT = new Image();
PLAYER_RIGHT.src = "img/player-right.png";

// Delta-time
const DEFAULT_FPS = 60;

// Players
const PLAYER_SPEED = 10;
const PLAYER_JUMP_FORCE = 25;
const DEFAULT_MAX_JUMPS = 2;

// Physics
const GRAVITY_FORCE = 2;

//#endregion

//#region Classes

// Represent a 2d shape
class Transform {
    x;
    y;
    width;
    height;

    /**
     * Constructor.
     * @param x Position of the transform in the X axis.
     * @param y Position of the transform in the Y axis.
     * @param width Width of the transform.
     * @param height Height of the transform.
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

// Represent a player
class Player {
    transform;
    type;
    direction = false;
    isGrounded = false;
    yVelocity = 0;
    jumpRemaining = DEFAULT_MAX_JUMPS;

    /**
     * Constructor.
     * @param transform Transform of the player.
     * @param type Type of the player.
     */
    constructor(transform = new Transform(), type = 0) {
        this.transform = transform;
        this.type = type;
    }
}


//#endregion

//#region Global variables

// Delta-time
let deltaTime = 0;
let lastTick = 0;

// server
let playerId;

// Players
let player = new Player(new Transform(0, 0,
    PLAYER_LEFT.width / 3, PLAYER_LEFT.height / 3));
let otherPlayers = [];

// Inputs
let inputLeft = false;
let inputRight = false;
let inputJump = false;

// Platforms
let platforms = [new Transform(600,700,300,80), new Transform(1200,500,300,80)];

//#endregion

// Main loop
setInterval(() => {
    // Skip if not in game
    if (openedPage !== 'game') {
        return;
    }

    // Delta-time
    deltaTime = (performance.now() - lastTick) / (1000 / DEFAULT_FPS);
    lastTick = performance.now();

    //#region Gravity

    // Apply the gravity to the player if he isn't grounded
    let groundDistance = CANVAS.height - player.transform.y - player.transform.height;
    let ceilDistance = CANVAS.height;
    let leftDistance = null;
    let rightDistance = null;

    for (let platform of platforms) {
        // Check that the platform is under the player and if its the nearest
        let distance = platform.y - player.transform.y - player.transform.height;
        if (platform.y >= player.transform.y + player.transform.height && player.transform.x <= platform.x + platform.width &&
        player.transform.x + player.transform.width >= platform.x && distance < groundDistance) {
            groundDistance = distance;
        }

        // Check that the platform is over the player and if its the nearest
        distance = player.transform.y - platform.y - platform.height;
        if (platform.y + platform.height <= player.transform.y && player.transform.x <= platform.x + platform.width &&
            player.transform.x + player.transform.width >= platform.x && distance < ceilDistance) {
            ceilDistance = distance;
        }

        // Left
        distance = player.transform.x - platform.x - platform.width;
        if (platform.x + platform.width <= player.transform.x && player.transform.y <= platform.y + platform.height &&
            player.transform.y + player.transform.height >= platform.y && (distance < leftDistance || leftDistance === null)) {
            leftDistance = distance;
        }

        // Right
        distance = platform.x - player.transform.x - player.transform.width;
        if (platform.x >= player.transform.x + player.transform.width && player.transform.y <= platform.y + platform.height &&
            player.transform.y + player.transform.height >= platform.y && (distance < rightDistance || rightDistance === null)) {
            rightDistance = distance;
        }
    }

    if (groundDistance === 0) {
        player.isGrounded = true;
    } else {
        player.yVelocity += GRAVITY_FORCE * deltaTime;
        player.isGrounded = false;

        if (player.yVelocity > 0 && groundDistance < player.yVelocity * deltaTime) {
            player.transform.y += groundDistance;
            player.yVelocity = 0;
            player.isGrounded = true;
        } else if (player.yVelocity < 0 && ceilDistance < -player.yVelocity * deltaTime) {
            player.transform.y -= ceilDistance;
            player.yVelocity = 0;
        }
    }

    // Reload jumps remaining
    if (player.isGrounded) {
        player.jumpRemaining = DEFAULT_MAX_JUMPS;
    }

    // Jump
    if (inputJump && player.jumpRemaining > 0) {
        inputJump = false;
        player.jumpRemaining--;

        player.yVelocity = -PLAYER_JUMP_FORCE;

        if (ceilDistance < -player.yVelocity * deltaTime) {
            player.transform.y -= ceilDistance;
            player.yVelocity = 0;
        }
    }

    player.transform.y += player.yVelocity * deltaTime;

    //#endregion

    //#region Movements

    // Move the player
    if (inputLeft && !inputRight) {
        if (leftDistance !== null && leftDistance < PLAYER_SPEED * deltaTime) {
            player.transform.x -= leftDistance;
        } else {
            player.transform.x -= PLAYER_SPEED * deltaTime;
        }

        player.direction = false;
    } else if (inputRight && !inputLeft) {
        if (rightDistance !== null && rightDistance < PLAYER_SPEED * deltaTime) {
            player.transform.x += rightDistance;
        } else {
            player.transform.x += PLAYER_SPEED * deltaTime;
        }

        player.direction = true;
    }

    //#endregion

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw the players
    let playersToDisplay = JSON.parse(JSON.stringify(lobby.players.map(e => e.playerObject)));
    let myIndex = lobby.players.map(e => e.id).indexOf(playerId);
    if (myIndex !== -1) {
        playersToDisplay.splice(myIndex, 1);
    }
    playersToDisplay.push(player);
    for (let playerToDisplay of playersToDisplay) {
        CTX.drawImage(playerToDisplay.direction ? PLAYER_RIGHT : PLAYER_LEFT, playerToDisplay.transform.x, playerToDisplay.transform.y,
            playerToDisplay.transform.width, playerToDisplay.transform.height);
    }

    // Draw the platforms
    for (let platform of platforms){
        CTX.fillStyle = "darkgreen";
        CTX.fillRect(platform.x, platform.y, platform.width, platform.height);
        CTX.strokeStyle = "black";
        CTX.lineWidth = 7;
        CTX.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }

    //#endregion

});

//#region Inputs

// Detect if a key is pressed
document.addEventListener("keydown", (e) => {
    // Left
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        inputLeft = true;
    }

    // Right
    if (e.key === "d"|| e.key === "D" || e.key === "ArrowRight") {
        inputRight = true;
    }

    // Jump
    if (e.key === " " || e.key === "ArrowUp") {
        inputJump = true;
    }
});

// Detect if a key is released
document.addEventListener("keyup", (e) => {
    // Left
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        inputLeft = false;
    }

    // Right
    if (e.key === "d"|| e.key === "D" || e.key === "ArrowRight") {
        inputRight = false;
    }

    // Jump
    if (e.key === " " || e.key === "ArrowUp") {
        inputJump = false;
    }
});

//#endregion
