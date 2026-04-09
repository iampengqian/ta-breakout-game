export class InputManager {
  constructor() {
    this.keys = {}
    this.setupEventListeners()
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true
    })

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false
    })
  }

  isKeyPressed(key) {
    return !!this.keys[key]
  }

  getLeftPressed() {
    return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('a')
  }

  getRightPressed() {
    return this.isKeyPressed('ArrowRight') || this.isKeyPressed('d')
  }
}