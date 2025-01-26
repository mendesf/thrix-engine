export type TypeConstructor<T extends object> = new () => T;

export type InstanceOrType<T extends object> = T | TypeConstructor<T>;

export function getConstructor<T extends object>(
    instanceOrConstructor: InstanceOrType<T>,
): TypeConstructor<T> {
    return (
        typeof instanceOrConstructor === "function"
            ? instanceOrConstructor
            : instanceOrConstructor.constructor
    ) as TypeConstructor<T>;
}

export function getInstance<T extends object>(instanceOrConstructor: InstanceOrType<T>): T {
    if (typeof instanceOrConstructor === "function") {
        return new (instanceOrConstructor as TypeConstructor<T>)();
    }
    return instanceOrConstructor as T;
}

export abstract class TypeRegistry<T extends object, U extends TypeConstructor<T>> {
    private types = new Array<U>();
    private indices = new Map<U, number>();

    get count(): number {
        return this.types.length;
    }

    register(ctor: U): void {
        const index = this.types.length;
        this.types.push(ctor);
        this.indices.set(ctor, index);
    }

    indexOf(ctor: U): number {
        const index = this.indices.get(ctor);
        if (index === undefined) {
            throw new Error(`Type ${ ctor.name } not registered`);
        }
        return index;
    }

    get(index: number): TypeConstructor<T> {
        return this.types[index];
    }
}
