export class Ball {
  constructor(x, y, radius, speedX, speedY) {
    this.x = x
    this.y = y
    this.radius = radius
    this.speedX = speedX
    this.speedY = speedY
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#0095DD'
    ctx.fill()
    ctx.closePath()
  }
}