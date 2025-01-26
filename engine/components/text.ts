import { Component } from "thrix/core";

export class Text extends Component {
	value: string;

	constructor(value = "") {
		super();
		this.value = value;
	}
}
