export class Brick {
  constructor(x, y, width, height, color, health = 1) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.health = health
    this.status = 1
  }

  draw(ctx) {
    if (!this.visible) return

    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)

    // Add border
    ctx.strokeStyle = '#000'
    ctx.strokeRect(this.x, this.y, this.width, this.height)
  }

  hit() {
    this.health--
    if (this.health <= 0) {
      this.visible = false
      return true
    }
    return false
  }

  destroy() {
    this.visible = false
    this.health = 0
  }
}