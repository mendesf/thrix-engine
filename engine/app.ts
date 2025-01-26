import type { Component } from "./core";
import type { ComponentConstructor } from "./core/component-registry";
import { type Plugin, PluginBuilder, type PluginType } from "thrix/core";
import type { SystemSchedule, SystemType } from "thrix/core";
import { SystemManager } from "thrix/core";
import { World, WorldRegistry } from "thrix/core";
import { Bitset } from "./std";

export class App {
    readonly world: World;

    constructor(world: World) {
        this.world = world;
    }

    init(): Promise<void> {
        return this.world.init();
    }
}

type Options = {
    readonly maxEntities?: number;
};

export class AppBuilder extends PluginBuilder {
    private constructor(registry: WorldRegistry) {
        super(registry);
    }

    static create({ maxEntities = 1000 }: Options = {}): AppBuilder {
        const config = new WorldRegistry(maxEntities);
        return new AppBuilder(config);
    }

    registerComponent<T extends Component>(ctor: ComponentConstructor<T>): AppBuilder {
        return <AppBuilder>super.registerComponent(ctor);
    }

    addSystem<T extends SystemType>(
        schedule: SystemSchedule,
        ctor: T,
        ...components: Array<ComponentConstructor>
    ): AppBuilder {
        return <AppBuilder>super.addSystem(schedule, ctor, ...components);
    }

    addPlugin<T extends Plugin>(ctor: PluginType<T>): AppBuilder {
        return <AppBuilder>super.addPlugin(ctor);
    }

    build(): App {
        const registry = new SystemManager();

        for (const system of this.systems) {
            const [schedule, systemType, components] = system;
            registry.systems[schedule].register(systemType);
            const signature = new Bitset(this.registry.components.count);
            for (const componentType of components) {
                signature.set(this.registry.components.indexOf(componentType));
            }
            const systemIndex = registry.systems[schedule].indexOf(systemType);
            registry.signatures[schedule][systemIndex] = signature;
            registry.entities[schedule][systemIndex] = [];
        }

        const world = new World(this.registry, registry);

        for (const resource of this.resources) {
            world.addResource(resource);
        }

        return new App(world);
    }
}
