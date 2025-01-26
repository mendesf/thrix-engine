import { Component } from "thrix/core";
import { Vec2 } from "thrix/std";

export class Velocity extends Component {
	value: Vec2;

	constructor(x = 0, y = 0) {
		super();
		this.value = new Vec2(x, y);
	}
}
