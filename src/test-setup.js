// Vitest setup for jsdom environment
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this callback = callback
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}