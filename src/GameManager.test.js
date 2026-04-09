import { GameManager } from './GameManager.js'
import { levelConfig, levelLayout } from './config/levels.js'

// Mock canvas
const createMockCanvas = (width, height) => ({
  width,
  height,
  getContext: () => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    closePath: jest.fn(),
    fillText: jest.fn()
  })
})

describe('GameManager', () => {
  let gameManager

  beforeEach(() => {
    // Mock canvas
    document.getElementById = jest.fn().mockReturnValue(createMockCanvas(480, 320))
    gameManager = new GameManager('gameCanvas')
  })

  test('Ball-paddle collision detection works', () => {
    const ball = gameManager.entities.ball
    const paddle = gameManager.entities.paddle

    // Position ball to hit paddle from above
    ball.x = paddle.x + paddle.width / 2
    ball.y = paddle.y - ball.radius

    // Move ball down to hit paddle
    ball.update()

    gameManager.checkCollisions()

    // Ball should bounce up
    expect(ball.speedY).toBeLessThan(0)
  })

  test('Ball reflects on Y-axis when hitting paddle top', () => {
    const ball = gameManager.entities.ball
    const paddle = gameManager.entities.paddle

    // Position ball to hit paddle top
    ball.x = paddle.x + paddle.width / 2
    ball.y = paddle.y - ball.radius

    gameManager.checkCollisions()

    // Ball should reverse Y direction
    expect(ball.speedY).toBeLessThan(0)
  })

  test('Ball reflects on X-axis when hitting paddle sides', () => {
    const ball = gameManager.entities.ball
    const paddle = gameManager.entities.paddle

    // Position ball to hit left side of paddle
    ball.x = paddle.x + ball.radius
    ball.y = paddle.y - ball.radius

    gameManager.checkCollisions()

    // Ball should have negative X speed (moving left)
    expect(ball.speedX).toBeLessThan(0)
  })

  test('Ball-brick collision detection works', () => {
    const ball = gameManager.entities.ball
    const brick = gameManager.entities.bricks[0][0]

    // Position ball to hit brick
    ball.x = brick.x + brick.width / 2
    ball.y = brick.y - ball.radius

    ball.update()

    gameManager.checkCollisions()

    // Brick should be hit
    expect(brick.visible).toBe(false)
  })

  test('Ball reflects on Y-axis when hitting brick top/bottom faces', () => {
    const ball = gameManager.entities.ball
    const brick = gameManager.entities.bricks[0][0]

    // Position ball to hit brick bottom
    ball.x = brick.x + brick.width / 2
    ball.y = brick.y + brick.height + ball.radius
    ball.speedY = -5 // Ball moving up

    gameManager.checkCollisions()

    // Ball should reverse Y direction (moving down)
    expect(ball.speedY).toBeGreaterThan(0)
  })

  test('Ball reflects on X-axis when hitting brick left/right faces', () => {
    const ball = gameManager.entities.ball
    const brick = gameManager.entities.bricks[0][0]

    // Position ball to hit brick right side
    ball.x = brick.x + brick.width + ball.radius
    ball.y = brick.y + brick.height / 2
    ball.speedX = -5 // Ball moving left

    gameManager.checkCollisions()

    // Ball should reverse X direction (moving right)
    expect(ball.speedX).toBeGreaterThan(0)
  })

  test('Brick destruction is implemented', () => {
    const brick = gameManager.entities.bricks[0][0]

    // First hit should not destroy brick
    expect(brick.hit()).toBe(false)
    expect(brick.visible).toBe(true)

    // Second hit should destroy brick
    expect(brick.hit()).toBe(true)
    expect(brick.visible).toBe(false)
  })

  test('Level configuration file exists', () => {
    expect(levelConfig).toBeDefined()
    expect(levelLayout).toBeDefined()
  })

  test('Level layout data is extracted to config', () => {
    expect(levelConfig).toEqual({
      brickRowCount: 3,
      brickColumnCount: 5,
      brickWidth: 75,
      brickHeight: 20,
      brickPadding: 10,
      brickOffsetTop: 30,
      brickOffsetLeft: 30
    })

    expect(levelLayout).toEqual([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ])
  })

  test('Score increases when bricks are destroyed', () => {
    const brick = gameManager.entities.bricks[0][0]

    // Hit brick to destroy it
    brick.hit()

    gameManager.checkCollisions()

    // Score should increase by 10
    expect(gameManager.score).toBe(10)
  })

  test('Victory condition is checked', () => {
    // Remove all bricks
    for (let r = 0; r < levelConfig.brickRowCount; r++) {
      for (let c = 0; c < levelConfig.brickColumnCount; c++) {
        gameManager.entities.bricks[r][c].visible = false
      }
    }

    gameManager.checkWinCondition()

    // Game state should be victory
    expect(gameManager.gameState).toBe('victory')
  })

  test('Victory condition triggers correctly', () => {
    // Destroy all bricks
    gameManager.entities.bricks.forEach(row => {
      row.forEach(brick => {
        if (brick) brick.visible = false
      })
    })

    gameManager.checkWinCondition()

    expect(gameManager.gameState).toBe('victory')
  })
})