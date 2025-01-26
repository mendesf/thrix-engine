import { Sprite as PixiSprite, Texture } from "pixi.js";
import { Sprite, Transform } from "thrix/components";
import type { UpdateSystemArgs } from "thrix/core/system.ts";
import { PixiResource } from "./pixi-resource.ts";
import { DisplayResource } from "thrix/resources";

export function adaptSprite({ world, entities }: UpdateSystemArgs): void {
    const pixi = world.getResource(PixiResource);
    const display = world.getResource(DisplayResource);

    for (const id of entities) {
        const entity = world.getEntity(id);
        const transform = entity.getComponent(Transform);
        const sprite = entity.getComponent(Sprite);

        if (!sprite || !transform) {
            continue
        }

        let pixiSprite = pixi.getSprite(sprite.id);
        if (!pixiSprite) {
            pixiSprite = pixi.addSprite(new PixiSprite(), sprite.id);
        }

        const x = transform.position.x;
        const y = transform.position.y;
        const inX = x >= 0 && x <= display.width;
        const inY = y >= 0 && y <= display.height;

        pixiSprite.visible = inX && inY;

        if (!inX || !inY) {
            continue;
        }

        if (sprite.asset) {
            const texture = pixi.getAsset<Texture>(sprite.asset);
            if (texture && pixiSprite.uid !== texture.uid) {
                pixiSprite.texture = texture;
            }
        }

        pixiSprite.anchor.x = sprite.anchor.x;
        pixiSprite.anchor.y = sprite.anchor.y;
        pixiSprite.updateTransform({
            x: x,
            y: y,
            rotation: transform.rotation,
            scaleX: transform.scale.x,
            scaleY: transform.scale.y,
        });
    }
}
