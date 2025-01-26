import type { World } from "./world";

export enum SystemSchedule {
	Startup = 0,
	Update = 1,
	Render = 2,
}

export const Startup = SystemSchedule.Startup;
export const Update = SystemSchedule.Update;
export const Render = SystemSchedule.Render;

export type StartupSystemArgs = Readonly<{
	world: World;
    entities: number[];
}>;

export type UpdateSystemArgs = Readonly<{
	world: World;
    entities: number[];
	deltaTime: number;
}>;

export type RenderSystemArgs = Readonly<{
    world: World;
    entities: number[];
}>;

export type StartupSystem = (args: StartupSystemArgs) => Promise<void> | void;

export type UpdateSystem = (args: UpdateSystemArgs) => Promise<void> | void;

export type RenderSystem = (args: RenderSystemArgs) => Promise<void> | void;

export type SystemType = StartupSystem | UpdateSystem | RenderSystem;
