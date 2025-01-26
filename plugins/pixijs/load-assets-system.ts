import type { UpdateSystemArgs } from "thrix/core/system.ts";
import { PixiResource } from "./pixi-resource.ts";
import { AssetsResource } from "thrix/resources/assets-resource.ts";

export function loadAssets({ world }: UpdateSystemArgs): void {
    const pixi = world.getResource(PixiResource);
    const assets = world.getResource(AssetsResource);
    const logError = (err: unknown) => console.error(`Failed to load asset`, { err });

    for (const [ alias, src ] of assets.assets) {
        assets.assets.delete(alias);
        pixi.loadAsset(src, alias).catch(logError);
    }
}
