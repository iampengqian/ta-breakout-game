import { GameManager } from './GameManager.js'

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new GameManager('gameCanvas')

  // Start the game when spacebar is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      if (game.getGameState() === 'waiting') {
        game.start()
      }
    }
  })
})