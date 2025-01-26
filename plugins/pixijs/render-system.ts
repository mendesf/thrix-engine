import type { RenderSystemArgs } from "thrix/core/system.ts";
import { PixiResource } from "./pixi-resource.ts";

export function render({ world }: RenderSystemArgs): void {
	const { app } = world.getResource(PixiResource);
	app.render();
}
