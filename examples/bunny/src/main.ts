import { PixiPlugin } from "plugins/pixijs";
import { StatsPlugin } from "plugins/stats";
import { AppBuilder, DefaultPlugin } from "thrix";
import { Startup, type StartupSystemArgs, Update } from "thrix/core/system";
import { DisplayResource } from "thrix/resources";
import { Bunny } from "./bunny";
import { BunnyCount } from "./bunny-count";
import { loadAsset, setupSpawner, spawnBunnies } from "./bunny-systems";
import { move } from "./movement-system";
import { rotate } from "./rotation-system";
import { Velocity } from "./velocity";
import { AngularVelocity } from "./angular-velocity";
import { Transform } from "thrix/components";

(async () => {
    const app = AppBuilder.create({ maxEntities: 10000 })
        .registerComponent(BunnyCount)
        .registerComponent(Bunny)
        .registerComponent(Velocity)
        .registerComponent(AngularVelocity)
        .addPlugin(DefaultPlugin)
        .addPlugin(PixiPlugin)
        .addPlugin(StatsPlugin)
        .addSystem(Startup, setup)
        .addSystem(Startup, loadAsset)
        .addSystem(Startup, setupSpawner)
        .addSystem(Update, spawnBunnies, BunnyCount)
        .addSystem(Update, move, Transform, Velocity, Bunny)
        .addSystem(Update, rotate, Transform, AngularVelocity, Bunny)
        .build();

    await app.init();
})();

function setup({ world }: StartupSystemArgs): void {
    const display = world.getResource(DisplayResource);
    display.backgroundColor = 0x1099bb;
}
