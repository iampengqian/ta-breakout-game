export class Paddle {
  constructor(x, y, width, height, speed) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = speed
    this.dx = 0
  }

  update(canvasWidth) {
    this.x += this.dx

    // Keep paddle within canvas bounds
    if (this.x < 0) {
      this.x = 0
    }
    if (this.x + this.width > canvasWidth) {
      this.x = canvasWidth - this.width
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#0095DD'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  moveLeft() {
    this.dx = -this.speed
  }

  moveRight() {
    this.dx = this.speed
  }

  stop() {
    this.dx = 0
  }
}