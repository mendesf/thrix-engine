import { Sprite, Text, Transform } from "thrix/components";
import { Plugin, type PluginBuilder } from "thrix/core";
import { DisplayResource } from "thrix/resources";
import { AssetsResource } from "thrix/resources/assets-resource";
import { RngResource } from "thrix/resources/rng-resource.ts";

export class DefaultPlugin extends Plugin {
    async build(builder: PluginBuilder): Promise<void> {
        builder
            .addResource(DisplayResource)
            .addResource(AssetsResource)
            .addResource(RngResource)
            .registerComponent(Transform)
            .registerComponent(Sprite)
            .registerComponent(Text);
    }
}
