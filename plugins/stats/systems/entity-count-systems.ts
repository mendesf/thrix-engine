import { Text, Transform } from "thrix/components";
import type { StartupSystemArgs, UpdateSystemArgs } from "thrix/core/system";
import { EntityCount } from "../components/entity-count";

export function spawnEntityCount({ world }: StartupSystemArgs): void {
	const entity = world.spawnEntity();
	entity.addComponent(EntityCount);
	entity.addComponent(Text);
	entity.addComponent(new Transform().withPosition(10, 40));
}

export function updateEntityCount({ world, entities }: UpdateSystemArgs): void {
	const entity = world.getEntity(entities[0]);
	const text = entity.getComponent(Text);
	text.value = world.entityCount().toString();
}
