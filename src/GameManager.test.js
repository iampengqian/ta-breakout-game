// Test for Game States Implementation
console.log('Testing Game States...')

// Test 1: Check GameState constants exist
const { GameState } = await import('./GameManager.js')
console.log('GameState constants:', GameState)

// Test 2: Basic game flow test
const { GameManager } = await import('./GameManager.js')

// Mock canvas
global.document = {
  createElement: jest.fn().mockImplementation((tag) => {
    if (tag === 'canvas') {
      return {
        width: 800,
        height: 600,
        getContext: () => ({
          clearRect: () => {},
          fillRect: () => {},
          strokeRect: () => {}
        })
      }
    }
    return {}
  })
}

// Mock window
global.window = {
  addEventListener: () => {}
}

try {
  const game = new GameManager('test')
  console.log('Initial state:', game.getGameState())

  // Test state transitions
  game.start()
  console.log('After start:', game.getGameState())

  game.pause()
  console.log('After pause:', game.getGameState())

  game.restart()
  console.log('After restart:', game.getGameState())

  // Test score
  console.log('Initial score:', game.getScore())

  console.log('All tests passed!')
} catch (error) {
  console.error('Test failed:', error)
}