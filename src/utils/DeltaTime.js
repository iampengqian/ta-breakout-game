class DeltaTime {
    constructor() {
        this.lastTime = 0;
        this.delta = 0;
        this.MAX_DELTA_TIME = 100; // Prevent tunneling at low frame rates
    }

    update(currentTime) {
        if (this.lastTime === 0) {
            this.lastTime = currentTime;
            return 0;
        }

        this.delta = Math.min(currentTime - this.lastTime, this.MAX_DELTA_TIME);
        this.lastTime = currentTime;

        return this.delta;
    }

    getDelta() {
        return this.delta;
    }

    reset() {
        this.lastTime = 0;
        this.delta = 0;
    }
}

export default DeltaTime;