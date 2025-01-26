import type { Component } from "./component";
import type { ComponentConstructor } from "./component-registry";
import type { World } from "./world";

export class Entity {
	readonly parent = -1;

	constructor(
		readonly id: number,
		private readonly world: World,
	) {}

	addComponent<T extends Component>(instanceOrConstructor: T | ComponentConstructor<T>): T {
		return this.world.addComponent(this.id, instanceOrConstructor);
	}

	getComponent<T extends Component>(ctor: ComponentConstructor<T>): T {
		return this.world.getComponent(this.id, ctor);
	}

	removeComponent<T extends Component>(ctor: ComponentConstructor<T>): void {
		this.world.removeComponent(this.id, ctor);
	}

	addChild(child: Entity): void {
		this.world.addEntityChild(this.id, child.id);
	}

	removeChild(child: Entity): void {
		this.world.removeEntityChild(this.id, child.id);
	}

	getChildren(): number[] {
		return this.world.entityChildren(this.id);
	}
}
