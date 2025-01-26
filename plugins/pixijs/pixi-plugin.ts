import { Sprite, Text, Transform } from "thrix/components";
import { Plugin, type PluginBuilder, Update } from "thrix/core";
import { Render, Startup } from "thrix/core/system.ts";
import { adaptSprite } from "./adapt-sprite-system.ts";
import { adaptText } from "./adapt-text-system.ts";
import { initPixi as setup } from "./init-pixi-system.ts";
import { loadAssets } from "./load-assets-system.ts";
import { render } from "./render-system.ts";
import { PixiResource } from "./pixi-resource.ts";
import { updateDisplay } from "./update-display-system.ts";

export class PixiPlugin extends Plugin {
    build(builder: PluginBuilder): void {
        builder
            .addResource(PixiResource)
            .addSystem(Startup, setup)
            .addSystem(Update, updateDisplay)
            .addSystem(Update, loadAssets)
            .addSystem(Render, adaptText, Transform, Text)
            .addSystem(Render, adaptSprite, Transform, Sprite)
            .addSystem(Render, render);
    }
}
