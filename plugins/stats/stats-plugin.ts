import { Text } from "thrix/components";
import { Plugin, type PluginBuilder } from "thrix/core";
import { Startup, Update } from "thrix/core/system";
import { EntityCount } from "./components/entity-count";
import { Fps } from "./components/fps";
import { spawnEntityCount, updateEntityCount } from "./systems/entity-count-systems";
import { spawnFps, updateFps } from "./systems/fps-systems";

export class StatsPlugin extends Plugin {
	build(builder: PluginBuilder): void {
		builder
			.registerComponent(Fps)
			.registerComponent(EntityCount)
			.addSystem(Startup, spawnFps)
			.addSystem(Startup, spawnEntityCount)
            .addSystem(Update, updateEntityCount, EntityCount, Text)
			.addSystem(Update, updateFps, Fps, Text)
	}
}
