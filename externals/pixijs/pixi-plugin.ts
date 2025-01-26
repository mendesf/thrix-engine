import { Sprite, Text, Transform } from "thrix/components";
import { Plugin, type PluginBuilder, Update } from "thrix/core";
import { Render, Startup } from "thrix/core/system";
import { adaptSprite } from "./adapt-sprite-system";
import { adaptText } from "./adapt-text-system";
import { initPixi as setup } from "./init-pixi-system";
import { loadAssets } from "./load-assets-system";
import { render } from "./render-system";
import { PixiResource } from "./pixi-resource";
import { updateDisplay } from "./update-display-system";

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
