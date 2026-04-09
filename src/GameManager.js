import { Ball } from './entities/Ball.js'
import { Paddle } from './entities/Paddle.js'
import { Brick } from './entities/Brick.js'
import { InputManager } from './InputManager.js'
import { levelConfig, levelLayout } from './config/levels.js'

export const GameState = {
  START: 'START',
  PLAYING: 'PLAYING',
  PAUSE: 'PAUSE',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
}

export class GameManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.inputManager = new InputManager()
    this.gameState = 'START'
    this.entities = {}
    this.animationId = null
    this.score = 0
    this.totalBricks = 0

    this.initializeEntities()
  }

  initializeEntities() {
    // Initialize ball
    this.entities.ball = new Ball(
      this.canvas.width / 2,
      this.canvas.height - 30,
      10,
      5,
      -5
    )

    // Initialize paddle
    this.entities.paddle = new Paddle(
      (this.canvas.width - 75) / 2,
      this.canvas.height - 10,
      75,
      10,
      8
    )

    // Initialize bricks
    this.entities.bricks = []
    this.score = 0
    this.createBricks()

    // Count total bricks for victory condition
    this.totalBricks = this.entities.bricks.length * this.entities.bricks[0].length
  }

  createBricks() {
    for (let r = 0; r < levelConfig.brickRowCount; r++) {
      this.entities.bricks[r] = []
      for (let c = 0; c < levelConfig.brickColumnCount; c++) {
        // Only create brick if layout indicates it should exist
        if (levelLayout[r] && levelLayout[r][c] === 1) {
          const brickX = c * (levelConfig.brickWidth + levelConfig.brickPadding) + levelConfig.brickOffsetLeft
          const brickY = r * (levelConfig.brickHeight + levelConfig.brickPadding) + levelConfig.brickOffsetTop
          this.entities.bricks[r][c] = new Brick(
            brickX,
            brickY,
            levelConfig.brickWidth,
            levelConfig.brickHeight,
            `hsl(${r * 60}, 70%, 50%)`
          )
        } else {
          this.entities.bricks[r][c] = null
        }
      }
    }
  }

  start() {
    if (this.gameState === GameState.START || this.gameState === GameState.PAUSE) {
      this.gameState = GameState.PLAYING
      this.gameLoop()
    }
  }

  pause() {
    if (this.gameState === GameState.PLAYING) {
      this.gameState = GameState.PAUSE
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
      }
    }
  }

  restart() {
    this.gameState = GameState.START
    this.score = 0
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.initializeEntities()
  }

  gameLoop() {
    if (this.gameState !== 'playing') return

    this.update()
    this.draw()

    this.animationId = requestAnimationFrame(() => this.gameLoop())
  }

  update() {
    // Check for spacebar restart
    if (this.inputManager.getSpacePressed()) {
      if (this.gameState === GameState.GAME_OVER || this.gameState === GameState.VICTORY) {
        this.restart()
      }
    }

    // Update paddle movement
    if (this.inputManager.getLeftPressed()) {
      this.entities.paddle.moveLeft()
    } else if (this.inputManager.getRightPressed()) {
      this.entities.paddle.moveRight()
    } else {
      this.entities.paddle.stop()
    }

    // Update paddle position
    this.entities.paddle.update(this.canvas.width)

    // Update ball position
    this.entities.ball.update()

    // Check collisions
    this.checkCollisions()

    // Check win condition
    this.checkWinCondition()
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw entities
    this.entities.ball.draw(this.ctx)
    this.entities.paddle.draw(this.ctx)

    // Draw bricks
    this.entities.bricks.forEach(row => {
      row.forEach(brick => {
        if (brick) {
          brick.draw(this.ctx)
        }
      })
    })

    // Draw score
    this.ctx.fillStyle = '#0095DD'
    this.ctx.font = '16px Arial'
    this.ctx.fillText(`Score: ${this.score}`, 8, 20)
  }

  getGameState() {
    return this.gameState
  }

  checkCollisions() {
    this.checkPaddleCollision()
    this.checkBrickCollisions()
  }

  checkPaddleCollision() {
    const ball = this.entities.ball
    const paddle = this.entities.paddle

    // Ball collision with paddle
    if (
      ball.x + ball.radius > paddle.x &&
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height
    ) {
      // Calculate hit position on paddle (-1 to 1)
      const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)

      // Reflect on Y-axis when hitting paddle top
      ball.speedY = -Math.abs(ball.speedY)

      // Add X-axis component based on where ball hits paddle
      ball.speedX = hitPos * 5
    }
  }

  checkBrickCollisions() {
    const ball = this.entities.ball

    for (let r = 0; r < levelConfig.brickRowCount; r++) {
      for (let c = 0; c < levelConfig.brickColumnCount; c++) {
        const brick = this.entities.bricks[r][c]

        if (brick && brick.visible) {
          // Ball collision with brick
          if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height
          ) {
            // Determine collision side
            const ballCenterX = ball.x
            const ballCenterY = ball.y
            const brickCenterX = brick.x + brick.width / 2
            const brickCenterY = brick.y + brick.height / 2

            // Calculate overlap on each axis
            const overlapX = (brick.width / 2 + ball.radius) - Math.abs(ballCenterX - brickCenterX)
            const overlapY = (brick.height / 2 + ball.radius) - Math.abs(ballCenterY - brickCenterY)

            // Reflect based on smallest overlap (collision side)
            if (overlapX < overlapY) {
              // Hit left or right side - reflect X-axis
              ball.speedX = -ball.speedX
            } else {
              // Hit top or bottom - reflect Y-axis
              ball.speedY = -ball.speedY
            }

            // Hit brick and update score
            if (brick.hit()) {
              this.score += 10
            }
          }
        }
      }
    }
  }

  checkWinCondition() {
    let bricksRemaining = 0

    for (let r = 0; r < levelConfig.brickRowCount; r++) {
      for (let c = 0; c < levelConfig.brickColumnCount; c++) {
        const brick = this.entities.bricks[r][c]
        if (brick && brick.visible) {
          bricksRemaining++
        }
      }
    }

    if (bricksRemaining === 0) {
      this.gameState = 'victory'
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
      }
    }
  }

  getScore() {
    return this.score
  }
}