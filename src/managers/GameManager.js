import Ball from '../entities/Ball.js';
import Paddle from '../entities/Paddle.js';
import InputManager from '../managers/InputManager.js';

class GameManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.canvas.width = 480;
        this.canvas.height = 320;

        // Game objects
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 30, 10, 4);
        this.paddle = new Paddle(this.canvas.width / 2 - 50, this.canvas.height - 20, 100, 10);
        this.inputManager = new InputManager();
        this.inputManager.setCanvasWidth(this.canvas.width);

        // Game state
        this.gameRunning = false;
        this.gameOver = false;

        // Start game loop
        this.start();
    }

    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.lastTime = 0;
            this.gameLoop(0);
        }
    }

    gameLoop(currentTime) {
        if (!this.gameRunning) return;

        // Update game state
        this.update(currentTime);

        // Render
        this.draw();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(currentTime) {
        if (this.gameOver) return;

        // Update ball with delta time
        this.ball.update(currentTime);

        // Check wall collisions
        const collisions = this.ball.checkWallCollision(this.canvas.width, this.canvas.height);

        // Handle game over
        if (collisions.bottom) {
            this.gameOver = true;
            this.onGameOver();
            return;
        }

        // Update paddle based on mouse position
        const mouseX = this.inputManager.getMouseX();
        this.paddle.update(mouseX, this.canvas.width);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ball
        this.ball.draw(this.ctx);

        // Draw paddle
        this.paddle.draw(this.ctx);

        // Draw game over text
        if (this.gameOver) {
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#0095DD';
            this.ctx.fillText('Game Over', this.canvas.width / 2 - 40, this.canvas.height / 2);
        }
    }

    onGameOver() {
        console.log('Game Over!');
        // You can add more game over handling here
    }

    reset() {
        this.gameOver = false;
        this.ball.reset(this.canvas.width / 2, this.canvas.height - 30);
    }
}

export default GameManager;