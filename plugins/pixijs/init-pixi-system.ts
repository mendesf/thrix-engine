import type { StartupSystemArgs } from "thrix/core/system.ts";
import { PixiResource } from "./pixi-resource.ts";
import { DisplayResource } from "thrix/resources";

export async function initPixi(args: StartupSystemArgs): Promise<void> {
    const { world } = args;
    const pixi = world.getResource(PixiResource);
    const display = world.getResource(DisplayResource);
    const { app } = pixi;

    await app.init({ autoStart: false, resizeTo: display.resizeTo });

    app.stage.addChild(pixi.sprites);
    app.stage.addChild(pixi.texts);
    document.body.appendChild(app.canvas);
}
