import { SparseSet } from "thrix/std";
import type { Component } from "./component";
import type { ComponentConstructor, ComponentRegistry } from "./component-registry";
import { getConstructor, getInstance } from "./type-registry";

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

export class ComponentManger {
    private readonly componentSets: Array<SparseSet<Component>>;
    private registry: ComponentRegistry;

    constructor(registry: ComponentRegistry, maxEntities: number) {
        this.registry = registry;
        this.componentSets = new Array(this.registry.count);
        for (let i = 0; i < this.componentSets.length; i++) {
            this.componentSets[i] = new SparseSet<Component>(maxEntities);
        }
    }

    getTypeIndex<T extends Component>(ctor: ComponentConstructor<T>): number {
        return this.registry.indexOf(ctor);
    }

    removeComponents(entity: number): void {
        for (const components of this.componentSets) {
            components.remove(entity);
        }
    }

    addComponent<T extends Component>(
        entity: number,
        instanceOrConstructor: T | ComponentConstructor<T>,
    ): T {
        const ctor = getConstructor(instanceOrConstructor);
        const index = this.registry.indexOf(ctor);
        const mutable = getInstance(instanceOrConstructor) as Mutable<T>;
        mutable.typeIndex = index;
        mutable.entity = entity;
        const instance = mutable as T;
        this.componentSets[index].set(entity, instance);
        return instance;
    }

    getComponent<T extends Component>(entity: number, ctor: ComponentConstructor<T>): T {
        const index = this.registry.indexOf(ctor);
        return this.componentSets[index].get(entity) as T;
    }

    removeComponent<T extends Component>(
        entity: number,
        indexOrType: number | ComponentConstructor<T>,
    ): void {
        const index =
            typeof indexOrType === "number" ? indexOrType : this.registry.indexOf(indexOrType);
        const components = this.componentSets[index];
        components.remove(entity);
    }
}
