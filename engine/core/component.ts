export class Component {
    readonly typeIndex: number;
    readonly entity: number;

	constructor() {
        this.typeIndex = -1;
		this.entity = -1;
	}

    get id(): string {
        return `${this.typeIndex}:${this.entity}`;
    }
}
