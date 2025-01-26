import { Bitset, SparseSet } from "thrix/std";
import { AnimationLoop } from "./animation-loop";
import type { Component } from "./component";
import { ComponentManger } from "./component-manager";
import { type ComponentConstructor, ComponentRegistry } from "./component-registry";
import { Entity } from "./entity";
import { EntityManager } from "./entity-manager";
import { Resource, ResourceManger, type ResourceType } from "./resource-manager";
import { type RenderSystem, type StartupSystem, SystemSchedule, type SystemType, type UpdateSystem, } from "./system";
import type { SystemManager } from "./system-manager";
import { SystemRegistry } from "./system-registry";
import { getConstructor } from "./type-registry";

export class WorldRegistry {
    readonly components = new ComponentRegistry();
    readonly systems = new Array<SystemRegistry<SystemType>>(
        new SystemRegistry<StartupSystem>(),
        new SystemRegistry<UpdateSystem>(),
    );

    constructor(readonly maxEntities: number) {
    }
}

export class World {
    readonly entitySignatures: SparseSet<Bitset>;
    private readonly entityManager: EntityManager;
    private readonly componentManager: ComponentManger;
    private readonly resourceManager = new ResourceManger();
    private readonly animationLoop = new AnimationLoop();

    constructor(
        readonly registry: WorldRegistry,
        readonly systemRegistry: SystemManager,
    ) {
        this.entitySignatures = new SparseSet<Bitset>(registry.maxEntities);
        this.entityManager = new EntityManager(this.entitySignatures);
        this.componentManager = new ComponentManger(registry.components, registry.maxEntities);
    }

    async init(): Promise<void> {
        for (let i = this.entitySignatures.count; i <= this.registry.maxEntities; i++) {
            this.entitySignatures.set(i, new Bitset(this.registry.components.count));
        }

        for (const value of this.resourceManager.resources.values()) {
            const resource = value as Resource;
            if (resource.init) await resource.init();
        }

        const startupRegistry = this.systemRegistry.systems[SystemSchedule.Startup];
        const startupSystems = startupRegistry.types as StartupSystem[];

        for await (const system of startupSystems) {
            const index = startupRegistry.indexOf(system);
            const systemSignature = this.systemRegistry.signatures[SystemSchedule.Startup][index];
            const systemEntities = this.systemRegistry.entities[SystemSchedule.Startup][index];
            if (systemEntities.length === 0 && !systemSignature.isEmpty()) continue;

            await system({ entities: systemEntities, world: this });
        }

        this.animationLoop.start(async (deltaTime) => {
            this.spawnEntities();
            await this.update(deltaTime);
            await this.render();
            this.despawnEntities();
        });
    }

    async update(deltaTime: number): Promise<void> {
        const updateRegistry = this.systemRegistry.systems[SystemSchedule.Update];

        for await (const system of updateRegistry.types) {
            const index = updateRegistry.indexOf(system);
            const systemSignature = this.systemRegistry.signatures[SystemSchedule.Update][index];
            const entities = this.systemRegistry.entities[SystemSchedule.Update][index];
            if (entities.length === 0 && !systemSignature.isEmpty()) continue;
            await system({ world: this, entities, deltaTime });
        }
    }

    async render(): Promise<void> {
        const renderRegistry = this.systemRegistry.systems[SystemSchedule.Render];

        for await (const system of renderRegistry.types as RenderSystem[]) {
            const index = renderRegistry.indexOf(system);
            const systemSignature = this.systemRegistry.signatures[SystemSchedule.Update][index];
            const entities = this.systemRegistry.entities[SystemSchedule.Update][index];
            if (entities.length === 0 && !systemSignature.isEmpty()) continue;
            await system({ world: this, entities });
        }
    }

    spawnEntity(): Entity {
        const id = this.entityManager.spawnEntity();
        return new Entity(id, this);
    }

    getEntity(entity: number): Entity {
        return new Entity(entity, this);
    }

    maxEntities(): number {
        return this.registry.maxEntities;
    }

    entityCount(): number {
        return this.entityManager.count;
    }

    despawnEntity(entityId: number): void {
        this.entityManager.despawnEntity(entityId);
    }

    addEntityChild(parentId: number, childId: number): void {
        this.entityManager.addChild(childId, parentId);
    }

    removeEntityChild(parentId: number, childId: number): void {
        this.entityManager.removeChild(parentId, childId);
    }

    entityChildren(entityId: number): number[] {
        return this.entityManager.children(entityId);
    }

    addComponent<T extends Component>(
        entityId: number,
        instanceOrConstructor: T | ComponentConstructor<T>,
    ): T {
        const ctor = getConstructor(instanceOrConstructor);
        const index = this.componentManager.getTypeIndex(ctor);
        const instance = this.componentManager.addComponent(entityId, instanceOrConstructor);
        this.entitySignatures.get(entityId)?.set(index);
        return instance;
    }

    getComponent<T extends Component>(entity: number, ctor: ComponentConstructor<T>): T {
        return this.componentManager.getComponent(entity, ctor);
    }

    removeComponent<T extends Component>(entityId: number, ctor: ComponentConstructor<T>): void {
        const componentIndex = this.componentManager.getTypeIndex(ctor);
        this.componentManager.removeComponent(entityId, componentIndex);
        this.entityManager.getEntitySignature(entityId)?.unset(componentIndex);
        const systemSignatures = this.systemRegistry.signatures[SystemSchedule.Update];
        for (let systemIndex = 0; systemIndex < systemSignatures.length; systemIndex++) {
            const systemSignature = systemSignatures[systemIndex];
            if (!systemSignature.isSet(componentIndex)) continue;
            this.systemRegistry.removeEntityFromSystem(entityId, systemIndex);
        }
    }

    addResource<T extends object>(resource: T): void {
        this.resourceManager.add(resource);
    }

    getResource<T extends object>(ctor: ResourceType<T>): T {
        return this.resourceManager.get(ctor);
    }

    private spawnEntities(): void {
        for (const entityId of this.entityManager.spawnList) {
            const entitySignature = this.entityManager.getEntitySignature(entityId);
            if (entitySignature === undefined) continue;
            this.systemRegistry.addEntityToSystems(entityId, entitySignature);
        }
        this.entityManager.spawnList.clear();
    }

    private despawnEntities(): void {
        for (const entityId of this.entityManager.despawnList) {
            this.componentManager.removeComponents(entityId);
            const entitySignature = this.entityManager.getEntitySignature(entityId);
            if (entitySignature === undefined) continue;
            this.systemRegistry.removeEntityFromSystems(entityId, entitySignature);
            this.entityManager.recycleEntity(entityId);
        }
        this.entityManager.despawnList.clear();
    }
}
