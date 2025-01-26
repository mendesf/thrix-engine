import { Sprite, Transform } from "thrix/components";
import { AngularVelocity } from "./angular-velocity";
import type { StartupSystemArgs, UpdateSystemArgs } from "thrix/core/system";
import { DisplayResource } from "thrix/resources";
import { randomSign } from "thrix/std";
import { Bunny } from "./bunny";
import { BunnyCount } from "./bunny-count";
import { AssetsResource } from "thrix/resources/assets-resource";
import { Velocity } from "./velocity";

const bunnyAsset = "bunny";

export function loadAsset({ world }: StartupSystemArgs): void {
    const assets = world.getResource(AssetsResource);
    assets.add("assets/bunny.png", bunnyAsset);
}

export function setupSpawner({ world }: StartupSystemArgs): void {
    const entity = world.spawnEntity();
    entity.addComponent(new BunnyCount(100));
}

export function spawnBunnies({ world, entities }: UpdateSystemArgs): void {
    const display = world.getResource(DisplayResource);
    const randomSpeed = (factor = 1.0) => Math.random() * randomSign() * factor;
    const entity = world.getEntity(entities[0]);
    const bunnyCount = entity.getComponent(BunnyCount);

    const max = Math.min(bunnyCount.value, world.maxEntities() - world.entityCount());
    for (let i = 0; i < max; i++) {
        const bunny = world.spawnEntity();
        bunny.addComponent(Bunny);
        bunny.addComponent(new Sprite().withAsset(bunnyAsset));
        bunny.addComponent(new Transform().withPosition(display.width / 2, display.height / 2));
        bunny.addComponent(new Velocity(randomSpeed(150), randomSpeed(150)));
        bunny.addComponent(new AngularVelocity(randomSpeed(5) * Math.PI));
    }

    if (max < bunnyCount.value) {
        world.despawnEntity(entity.id);
    }
}
