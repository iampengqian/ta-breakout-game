class CanvasScaler {
  constructor() {
    // Virtual resolution constants
    this.VIRTUAL_WIDTH = 800;
    this.VIRTUAL_HEIGHT = 600;

    // Actual canvas dimensions
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    // Scale factors
    this.scaleX = 1;
    this.scaleY = 1;

    // Offset for centering
    this.offsetX = 0;
    this.offsetY = 0;

    // Initialize
    this.init();
  }

  init() {
    // Set up resize handler
    window.addEventListener('resize', () => this.resize());
    // Initial resize
    this.resize();
  }

  resize() {
    // Get the actual canvas element
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Get available screen space
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    // Calculate scale to fit while maintaining aspect ratio
    const scaleX = availableWidth / this.VIRTUAL_WIDTH;
    const scaleY = availableHeight / this.VIRTUAL_HEIGHT;

    // Use the smaller scale to ensure everything fits
    this.scaleX = this.scaleY = Math.min(scaleX, scaleY);

    // Calculate canvas dimensions
    this.canvasWidth = this.VIRTUAL_WIDTH * this.scaleX;
    this.canvasHeight = this.VIRTUAL_HEIGHT * this.scaleY;

    // Calculate offsets for centering
    this.offsetX = (availableWidth - this.canvasWidth) / 2;
    this.offsetY = (availableHeight - this.canvasHeight) / 2;

    // Update canvas style
    canvas.style.width = `${this.canvasWidth}px`;
    canvas.style.height = `${this.canvasHeight}px`;
    canvas.style.position = 'absolute';
    canvas.style.left = `${this.offsetX}px`;
    canvas.style.top = `${this.offsetY}px`;

    // Update actual canvas internal dimensions for crisp rendering
    canvas.width = this.VIRTUAL_WIDTH;
    canvas.height = this.VIRTUAL_HEIGHT;
  }

  /**
   * Convert screen coordinates to virtual coordinates
   * @param {number} screenX - Screen X coordinate
   * @param {number} screenY - Screen Y coordinate
   * @returns {{x: number, y: number}} Virtual coordinates
   */
  screenToVirtual(screenX, screenY) {
    // Account for offset
    const adjustedX = screenX - this.offsetX;
    const adjustedY = screenY - this.offsetY;

    // Convert to virtual space
    const virtualX = adjustedX / this.scaleX;
    const virtualY = adjustedY / this.scaleY;

    return {
      x: virtualX,
      y: virtualY
    };
  }

  /**
   * Get current scale factor
   * @returns {number} Scale factor
   */
  getScale() {
    return this.scaleX;
  }

  /**
   * Get virtual resolution
   * @returns {{width: number, height: number}} Virtual dimensions
   */
  getVirtualResolution() {
    return {
      width: this.VIRTUAL_WIDTH,
      height: this.VIRTUAL_HEIGHT
    };
  }
}

// Export singleton instance
const canvasScaler = new CanvasScaler();
export default canvasScaler;

// Export class for multiple instances if needed
export { CanvasScaler };