export type ResourceType<T extends object> = new () => T;

export class ResourceManger {
	readonly resources: Map<ResourceType<object>, object> = new Map();

	add<T extends object>(resource: T): void {
		const ctor = resource.constructor as ResourceType<T>;
		if (this.resources.has(ctor)) {
			throw new Error(`Resource ${ctor.name} already exists`);
		}
		this.resources.set(ctor, resource);
	}

	has<T extends object>(ctor: ResourceType<T>): boolean {
		return this.resources.has(ctor);
	}

	get<T extends object>(ctor: ResourceType<T>): T {
		return this.resources.get(ctor) as T;
	}
}
