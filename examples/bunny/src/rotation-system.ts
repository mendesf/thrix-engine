import { Transform } from "thrix/components";
import type { UpdateSystemArgs } from "thrix/core/system";
import { AngularVelocity } from "./angular-velocity";

export function rotate({ world, entities, deltaTime }: UpdateSystemArgs): void {
    for (const entity of entities) {
        const transform = world.getComponent(entity, Transform);
        const velocity = world.getComponent(entity, AngularVelocity);
        transform.rotation += velocity.value * deltaTime;
    }
}
