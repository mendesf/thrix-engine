import { Component } from "thrix/core";

export class Fps extends Component {
	value: number;

	constructor(value = 0) {
		super();
		this.value = value;
	}
}
