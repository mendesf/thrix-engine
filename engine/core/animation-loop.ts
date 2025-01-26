export type Update = (deltaTime: number) => void;

export class AnimationLoop {
	private previousTimestamp = 0;
	private isRunning = false;

	public start(update: Update): void {
		this.isRunning = true;

		const loop = (timestamp: number) => {
			if (!this.isRunning) return;

			if (!this.previousTimestamp) {
				this.previousTimestamp = timestamp;
			}

			const deltaTime = (timestamp - this.previousTimestamp) / 1000;
			this.previousTimestamp = timestamp;

			update(deltaTime);
			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	}

	public stop(): void {
		this.isRunning = false;
	}
}
