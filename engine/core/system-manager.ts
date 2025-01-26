import type { Bitset } from "thrix/std";
import { SystemSchedule, type SystemType } from "./system";
import { SystemRegistry } from "./system-registry";

const SCHEDULE_COUNT = Object.keys(SystemSchedule).length / 2;

export class SystemManager {
	readonly systems = new Array<SystemRegistry<SystemType>>(SCHEDULE_COUNT);
	readonly signatures = new Array<Bitset[]>(SCHEDULE_COUNT);
	readonly entities = new Array<number[][]>(SCHEDULE_COUNT);

	constructor() {
		for (let i = 0; i < SCHEDULE_COUNT; i++) {
			this.systems[i] = new SystemRegistry();
			this.signatures[i] = [];
			this.entities[i] = [];
		}
	}

	addEntityToSystems(entityId: number, entitySignature: Bitset): void {
		const signatures = this.signatures[SystemSchedule.Update];
		for (let i = 0; i < signatures.length; i++) {
			const systemSignature = signatures[i];
			if (!systemSignature.matches(entitySignature)) continue;
			this.entities[SystemSchedule.Update][i].push(entityId);
		}
	}

	removeEntityFromSystem(entityId: number, systemIndex: number): void {
		const entities = this.entities[SystemSchedule.Update][systemIndex];
		const entityIndex = entities.indexOf(entityId);
		if (entityIndex === -1) return;
		const lastEntity = entities.pop();
		if (lastEntity === undefined || lastEntity === entityId) return;
		entities.splice(entityIndex, 1, lastEntity);
	}

	removeEntityFromSystems(entityId: number, entitySignature: Bitset): void {
		const updateRegistry = this.systems[SystemSchedule.Update];
		for (const system of updateRegistry.types) {
			const index = updateRegistry.indexOf(system);
			const systemSignature = this.signatures[SystemSchedule.Update][index];
			if (!systemSignature.matches(entitySignature)) continue;
			this.removeEntityFromSystem(entityId, index);
		}
	}
}
