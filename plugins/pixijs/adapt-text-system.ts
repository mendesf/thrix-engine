import { Text as PixiText } from "pixi.js";
import { Text, Transform } from "thrix/components";
import type { UpdateSystemArgs } from "thrix/core/system.ts";
import { PixiResource } from "./pixi-resource.ts";

export function adaptText({ world, entities }: UpdateSystemArgs): void {
    const pixi = world.getResource(PixiResource);

    for (const id of entities) {
        const entity = world.getEntity(id);
        const transform = entity.getComponent(Transform);
        const text = entity.getComponent(Text);

        if (!text || !transform) {
            continue;
        }

        let pixiText = pixi.getText(text.id);
        if (!pixiText) {
            pixiText = pixi.addText(new PixiText(), text.id);
        }

        pixiText.text = text.value;
        pixiText.x = transform.position.x;
        pixiText.y = transform.position.y;
    }
}
