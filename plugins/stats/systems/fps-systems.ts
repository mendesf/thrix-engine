import { Text, Transform } from "thrix/components";
import type { StartupSystemArgs, UpdateSystemArgs } from "thrix/core/system";
import { Fps } from "../components/fps";

export function spawnFps({ world }: StartupSystemArgs): void {
	const entity = world.spawnEntity();
	entity.addComponent(Fps);
	entity.addComponent(Text);
	entity.addComponent(new Transform().withPosition(10, 10));
}

export function updateFps({ world, entities, deltaTime }: UpdateSystemArgs): void {
	const entity = world.getEntity(entities[0]);
	const fps = entity.getComponent(Fps);
	const text = entity.getComponent(Text);
	const safeDeltaTime = Math.max(deltaTime, 0.0001);
	fps.value = 0.9 * fps.value + 0.1 / safeDeltaTime;
	text.value = fps.value.toFixed(2);
}
