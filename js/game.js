/**
 * Jeu-bossfight - Code of the game.
 */

//#region Constants

// Get the canvas and its 2d context
const CANVAS = document.querySelector("canvas");
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

// Physics
const GRAVITY_FORCE = 2;

//#endregion

//#region Classes

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

class Player {
    transform;
    type;
    direction = false;
    isGrounded = false;
    yVelocity = 0;

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

// Players
let player = new Player(new Transform(0, 0,
    PLAYER_LEFT.width / 3, PLAYER_LEFT.height / 3));
let otherPlayers = [];

// Inputs
let inputLeft = false;
let inputRight = false;
let inputJump = false;

//#endregion

// Main loop
setInterval(() => {
    // Delta-time
    deltaTime = (performance.now() - lastTick) / (1000 / DEFAULT_FPS);
    lastTick = performance.now();

    //#region Gravity

    // Apply the gravity to the player if he isn't grounded
    if (player.transform.y + player.transform.height === CANVAS.height) {
        player.isGrounded = true;
    } else {
        player.yVelocity += GRAVITY_FORCE * deltaTime;
        player.isGrounded = false;

        if (player.transform.y + player.transform.height >= CANVAS.height) {
            player.transform.y = CANVAS.height - player.transform.height;
            player.yVelocity = 0;
            player.isGrounded = true;
        }
    }

    // Jump
    if (inputJump) {
        inputJump = false;

        if (player.isGrounded) {
            player.yVelocity = -PLAYER_JUMP_FORCE;
        }
    }

    player.transform.y += player.yVelocity * deltaTime;

    //#endregion

    //#region Movements

    // Move the player
    if (inputLeft && !inputRight) {
        player.transform.x -= PLAYER_SPEED * deltaTime;
        player.direction = false;
    } else if (inputRight && !inputLeft) {
        player.transform.x += PLAYER_SPEED * deltaTime;
        player.direction = true;
    }

    //#enregion

    //#region Display

    //console.log("Delta-time : " + deltaTime);

    // Clear the canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // Draw the players
    let playersToDisplay = JSON.parse(JSON.stringify(otherPlayers));
    playersToDisplay.push(player);
    for (let playerToDisplay of playersToDisplay) {
        CTX.drawImage(player.direction ? PLAYER_RIGHT : PLAYER_LEFT, playerToDisplay.transform.x, playerToDisplay.transform.y,
            playerToDisplay.transform.width, playerToDisplay.transform.height);
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
