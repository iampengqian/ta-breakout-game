import { Ball } from './entities/Ball.js'
import { Paddle } from './entities/Paddle.js'
import { Brick } from './entities/Brick.js'
import { InputManager } from './InputManager.js'

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
    this.createBricks()

    // Count total bricks for victory condition
    this.totalBricks = this.entities.bricks.length * this.entities.bricks[0].length
  }

  createBricks() {
    const brickRowCount = 3
    const brickColumnCount = 5
    const brickWidth = 75
    const brickHeight = 20
    const brickPadding = 10
    const brickOffsetTop = 30
    const brickOffsetLeft = 30

    for (let r = 0; r < brickRowCount; r++) {
      this.entities.bricks[r] = []
      for (let c = 0; c < brickColumnCount; c++) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        this.entities.bricks[r][c] = new Brick(
          brickX,
          brickY,
          brickWidth,
          brickHeight,
          `hsl(${r * 60}, 70%, 50%)`
        )
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

    // Check ball collision with walls
    this.checkWallCollision()

    // Check ball collision with paddle
    this.checkPaddleCollision()

    // Check ball collision with bricks
    this.checkBrickCollision()

    // Check victory condition
    this.checkVictoryCondition()
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
        if (brick.status === 1) {
          brick.draw(this.ctx)
        }
      })
    })
  }

  getGameState() {
    return this.gameState
  }

  checkWallCollision() {
    const ball = this.entities.ball

    // Left and right walls
    if (ball.x + ball.dx > this.canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx
    }

    // Top wall
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy
    }

    // Bottom wall - game over
    if (ball.y + ball.dy > this.canvas.height - ball.radius) {
      this.gameOver()
    }
  }

  checkPaddleCollision() {
    const ball = this.entities.ball
    const paddle = this.entities.paddle

    // Check if ball is hitting paddle
    if (
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width &&
      ball.y + ball.radius > paddle.y
    ) {
      ball.dy = -ball.dy

      // Add some spin based on where the ball hits the paddle
      const hitPos = (ball.x - paddle.x) / paddle.width
      ball.dx = 8 * (hitPos - 0.5)
    }
  }

  checkBrickCollision() {
    const ball = this.entities.ball

    // Check collision with each brick
    for (let r = 0; r < this.entities.bricks.length; r++) {
      for (let c = 0; c < this.entities.bricks[r].length; c++) {
        const brick = this.entities.bricks[r][c]

        if (brick.status === 1) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height
          ) {
            ball.dy = -ball.dy
            brick.status = 0
            this.score += 10
          }
        }
      }
    }
  }

  checkVictoryCondition() {
    let remainingBricks = 0

    // Count remaining bricks
    for (let r = 0; r < this.entities.bricks.length; r++) {
      for (let c = 0; c < this.entities.bricks[r].length; c++) {
        if (this.entities.bricks[r][c].status === 1) {
          remainingBricks++
        }
      }
    }

    // If no bricks remain, victory
    if (remainingBricks === 0) {
      this.victory()
    }
  }

  gameOver() {
    this.gameState = GameState.GAME_OVER
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  victory() {
    this.gameState = GameState.VICTORY
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  getScore() {
    return this.score
  }
}