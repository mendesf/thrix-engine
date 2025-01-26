export class Vec2 {
	constructor(
		public x: number,
		public y: number,
	) {}

	static splat(value: number): Vec2 {
		return new Vec2(value, value);
	}

	static zero(): Vec2 {
		return new Vec2(0, 0);
	}

	static one(): Vec2 {
		return new Vec2(1, 1);
	}

	static from(x: number, y: number): Vec2 {
		return new Vec2(x, y);
	}

	set(x: number, y: number): Vec2 {
		this.x = x;
		this.y = y;
		return this;
	}

	mul(scalar: number): Vec2 {
		return new Vec2(this.x * scalar, this.y * scalar);
	}
}
