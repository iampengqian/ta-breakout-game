class InputManager {
    constructor() {
        this.mouseX = 0;
        this.canvasWidth = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
        });
    }

    setCanvasWidth(width) {
        this.canvasWidth = width;
    }

    getMouseX() {
        return this.mouseX;
    }
}

export default InputManager;