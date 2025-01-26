import type { UpdateSystemArgs } from "thrix/core/system";
import { PixiResource } from "./pixi-resource";
import { AssetsResource } from "thrix/resources/assets-resource";

export function loadAssets({ world }: UpdateSystemArgs): void {
    const pixi = world.getResource(PixiResource);
    const assets = world.getResource(AssetsResource);
    const logError = (err: unknown) => console.error(`Failed to load asset`, { err });

    for (const [ alias, src ] of assets.assets) {
        assets.assets.delete(alias);
        pixi.loadAsset(src, alias).catch(logError);
    }
}
