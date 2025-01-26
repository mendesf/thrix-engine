import { Sprite, Text, Transform } from "thrix/components";
import { Plugin, type PluginBuilder } from "thrix/core";
import { DisplayResource } from "thrix/resources";
import { AssetsResource } from "thrix/resources/assets-resource";

export class DefaultPlugin extends Plugin {
    build(builder: PluginBuilder): void {
        builder
            .addResource(DisplayResource)
            .addResource(AssetsResource)
            .registerComponent(Transform)
            .registerComponent(Sprite)
            .registerComponent(Text);
    }
}
