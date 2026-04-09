import { Ball } from './entities/Ball.js'
import { Paddle } from './entities/Paddle.js'
import { Brick } from './entities/Brick.js'
import { InputManager } from './InputManager.js'

export class GameManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.inputManager = new InputManager()
    this.gameState = 'waiting' // waiting, playing, paused, gameOver
    this.entities = {}
    this.animationId = null

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
    if (this.gameState === 'waiting' || this.gameState === 'paused') {
      this.gameState = 'playing'
      this.gameLoop()
    }
  }

  pause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused'
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
      }
    }
  }

  reset() {
    this.gameState = 'waiting'
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
        brick.draw(this.ctx)
      })
    })
  }

  getGameState() {
    return this.gameState
  }
}