import type { Bitset, SparseSet } from "thrix/std";

export class EntityManager {
	private _count = 0;
	private readonly pool = new Array<number>();
	readonly spawnList = new Set<number>();
	readonly despawnList = new Set<number>();
	readonly childrenMap = new Map<number, Set<number>>();
	readonly parentMap = new Map<number, number>();

	constructor(private readonly signatures: SparseSet<Bitset>) {}

	get count(): number {
		return this._count;
	}

	spawnEntity(): number {
		const entityId = this.pool.pop() ?? this._count++;
		this.spawnList.add(entityId);
		return entityId;
	}

	getEntitySignature(entityId: number): Bitset | undefined {
		return this.signatures.get(entityId);
	}

	despawnEntity(entityId: number): void {
		this.despawnList.add(entityId);
	}

	recycleEntity(entityId: number): void {
		this.getEntitySignature(entityId)?.reset();
		if (entityId >= this._count) return;
		this.pool.push(entityId);
	}

	addChild(parentId: number, childId: number): void {
		if (!this.childrenMap.has(parentId)) {
			this.childrenMap.set(parentId, new Set<number>());
		}
		this.childrenMap.get(parentId)?.add(childId);
		this.parentMap.set(childId, parentId);
	}

	removeChild(parentId: number, childId: number): void {
		this.childrenMap.get(parentId)?.delete(childId);
		if (this.childrenMap.get(parentId)?.size === 0) {
			this.childrenMap.delete(parentId);
		}
	}

	children(entityId: number): number[] {
		const children = this.childrenMap.get(entityId);
		if (!children) return [];
		return Array.from(children.values());
	}

	getParent(entityId: number): number {
		return this.parentMap.get(entityId) ?? -1;
	}
}
