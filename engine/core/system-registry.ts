import type { SystemType } from "./system";

export class SystemRegistry<T extends SystemType> {
	readonly types = new Array<T>();
	private indices = new Map<T, number>();

	get count(): number {
		return this.types.length;
	}

	register(ctor: T): void {
		const index = this.types.length;
		this.types.push(ctor);
		this.indices.set(ctor, index);
	}

	has(ctor: T): boolean {
		return this.indices.has(ctor);
	}

	indexOf(ctor: T): number {
		const index = this.indices.get(ctor);
		if (index === undefined) {
			throw new Error(`Type ${ctor.name} not registered`);
		}
		return index;
	}

	get(index: number): T {
		return this.types[index];
	}
}
