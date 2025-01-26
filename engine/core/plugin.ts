import type { Component } from "./component";
import type { ComponentConstructor } from "./component-registry";
import { ResourceType } from "./resource-manager";
import type { SystemSchedule, SystemType } from "./system";
import { getInstance, type TypeConstructor } from "./type-registry";
import type { WorldRegistry } from "./world";

export abstract class Plugin {
	abstract build(builder: PluginBuilder): void;
}

export type PluginType<T extends Plugin> = TypeConstructor<T> & { new (registry: WorldRegistry): T };

export type SystemEntry = [SystemSchedule, SystemType, Array<ComponentConstructor>];

export abstract class PluginBuilder {
	protected readonly resources = new Array<object>();
	protected readonly systems = new Array<SystemEntry>();

	protected constructor(protected readonly registry: WorldRegistry) {}

	addPlugin<T extends Plugin>(ctor: PluginType<T>): PluginBuilder {
		const plugin = new ctor(this.registry);
		plugin.build(this);
		return this;
	}

	registerComponent<T extends Component>(ctor: ComponentConstructor<T>): PluginBuilder {
		this.registry.components.register(ctor);
		return this;
	}

	addResource<T extends object>(instanceOrConstructor: T | ResourceType<T>): PluginBuilder {
		const instance = getInstance(instanceOrConstructor);
		this.resources.push(instance);
		return this;
	}

	addSystem<T extends SystemType>(
		schedule: SystemSchedule,
		ctor: T,
		...components: Array<ComponentConstructor>
	): PluginBuilder {
		this.systems.push([schedule, ctor, components]);
		return this;
	}
}
