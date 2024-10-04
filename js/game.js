/**
 * Jeu-bossfight - Code of the game.
 */

// Constants

// Get the canvas and its 2d context
const CANVAS = document.querySelector("canvas");
const CTX = CANVAS.getContext("2d");

// Delta-time
const DEFAULT_FPS = 120;

// Classes
class Transform {
    x = 0;
    y = 0;
    width = 0;
    height = 0;

    /**
     * Constructor.
     * @param x Position of the transform in the X axis.
     * @param y Position of the transform in the Y axis.
     * @param width Width of the transform.
     * @param height Height of the transform.
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Player {
    transform = new Transform();
    type = 0;

    /**
     * Constructor.
     * @param transform Transform of the player.
     * @param type Type of the player.
     */
    constructor(transform, type) {
        this.transform = transform;
        this.type = type;
    }
}

// Global variables

// Delta-time
let deltatime = 0;
let lasttick = 0;

// Players
let player = new Player();
let otherPlayers = [];

// Main loop
setInterval(() => {
    // Delta-time
    deltaTime = (performance.now() - lastTick) / (1000 / DEFAULT_FPS);
    lastTick = performance.now();
});