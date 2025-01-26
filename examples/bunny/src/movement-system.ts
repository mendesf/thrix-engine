import { Transform } from "thrix/components";
import type { UpdateSystemArgs } from "thrix/core/system";
import { Velocity } from "./velocity";

export function move({ world, entities, deltaTime }: UpdateSystemArgs): void {
    for (const id of entities) {
        const entity = world.getEntity(id);
        const transform = entity.getComponent(Transform);
        const velocity = entity.getComponent(Velocity);
        transform.position.x += velocity.value.x * deltaTime;
        transform.position.y += velocity.value.y * deltaTime;
    }
}
