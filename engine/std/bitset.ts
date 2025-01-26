export class Bitset {
	public readonly buffer: Uint32Array;
	public readonly size: number;

	constructor(size: number) {
		this.size = size;
		this.buffer = new Uint32Array((size + 31) >>> 5);
	}

	public set(index: number): void {
		const wordIndex = index >>> 5;
		const bitIndex = index & 31;
		this.buffer[wordIndex] |= 1 << bitIndex;
	}

	public unset(index: number): void {
		const wordIndex = index >>> 5;
		const bitIndex = index & 31;
		this.buffer[wordIndex] &= ~(1 << bitIndex);
	}

	public isSet(index: number): boolean {
		const wordIndex = index >>> 5;
		const bitIndex = index & 31;
		return (this.buffer[wordIndex] & (1 << bitIndex)) !== 0;
	}

	public isEmpty(): boolean {
		for (let i = 0; i < this.buffer.length; i++) {
			if (this.buffer[i] !== 0) {
				return false;
			}
		}
		return true;
	}

	public matches(other: Bitset): boolean {
		for (let i = 0; i < this.buffer.length; i++) {
			const valueA = this.buffer[i];
			const valueB = other.buffer[i];
			if ((valueA & valueB) !== valueA) {
				return false;
			}
		}
		return true;
	}

	public toString(): string {
		const parts: string[] = [];
		for (let i = 0; i < this.buffer.length; i++) {
			parts.push(this.buffer[i].toString(2).padStart(32, "0"));
		}
		return parts.join("");
	}

	public reset(): void {
		this.buffer.fill(0);
	}
}
