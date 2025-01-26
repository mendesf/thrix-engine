import { Component } from "thrix/core";
import { Vec2 } from "thrix/std";

export class Transform extends Component {
	scale: Vec2;
	position: Vec2;
	rotation: number;

	constructor() {
		super();
		this.scale = Vec2.splat(1.0);
		this.position = Vec2.splat(0.0);
		this.rotation = 0.0;
	}

	

	withScale(x: number, y: number): Transform {
		this.scale.set(x, y);
		return this;
	}

	withPosition(x: number, y: number): Transform {
		this.position.set(x, y);
		return this;
	}

	withRotation(rotation: number): Transform {
		this.rotation = rotation;
		return this;
	}
}
