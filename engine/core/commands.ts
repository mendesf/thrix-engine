import type { Component } from "./component";
import type { ComponentConstructor } from "./component-registry";
import type { Entity } from "./entity";
import type { World } from "./world";

export class Commands {
	constructor(protected world: World) {}

	spawnEntity(): Entity {
		return this.world.spawnEntity();
	}

	despawnEntity(entityId: number): void {
		this.world.despawnEntity(entityId);
	}

	addComponent<T extends Component>(
		entityId: number,
		instanceOrConstructor: T | ComponentConstructor<T>,
	): void {
		this.world.addComponent(entityId, instanceOrConstructor);
	}

	removeComponent<T extends Component>(entityId: number, ctor: ComponentConstructor<T>): void {
		this.world.removeComponent(entityId, ctor);
	}
}
