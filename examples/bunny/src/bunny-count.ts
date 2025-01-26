import { Component } from "thrix/core";

export class BunnyCount extends Component {
	readonly value: number;

	constructor(value = 0) {
		super();
		this.value = value;
	}
}
