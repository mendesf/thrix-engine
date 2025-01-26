import type { UpdateSystemArgs } from "thrix/core/system";
import { DisplayResource } from "thrix/resources";
import { PixiResource } from "./pixi-resource";

export function updateDisplay({ world }: UpdateSystemArgs): void {
    const { app } = world.getResource(PixiResource);
    const display = world.getResource(DisplayResource);

    display.width = app.screen.width;
    display.height = app.screen.height;
    app.renderer.background.color = display.backgroundColor;
    app.resizeTo = display.resizeTo;
}
