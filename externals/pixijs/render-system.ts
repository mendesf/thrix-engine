import type { RenderSystemArgs } from "thrix/core/system";
import { PixiResource } from "./pixi-resource";

export function render({ world }: RenderSystemArgs): void {
	const { app } = world.getResource(PixiResource);
	app.render();
}
