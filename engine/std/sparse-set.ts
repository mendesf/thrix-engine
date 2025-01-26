export class SparseSet<T> {
    private readonly indices: Int32Array;
    private readonly keys: Int32Array;
    private readonly items: Array<T | undefined>;
    private _count: number;

    private static readonly EMPTY: number = -1;

    get count(): number {
        return this._count;
    }

    constructor(capacity: number) {
        this.indices = new Int32Array(capacity);
        this.keys = new Int32Array(capacity);
        this.items = new Array(capacity);
        this._count = 0;
        for (let i = 0; i < capacity; i++) {
            this.indices[i] = SparseSet.EMPTY;
            this.keys[i] = SparseSet.EMPTY;
        }
    }

    set(key: number, item: T): void {
        const index = this.indices[key];
        if (index === SparseSet.EMPTY) {
            const insertIndex = this._count;
            this.indices[key] = insertIndex;
            this.keys[insertIndex] = key;
            this.items[insertIndex] = item;
            this._count++;
            return;
        }
        this.items[index] = item;
    }

    remove(key: number): void {
        const index = this.indices[key];
        if (index === SparseSet.EMPTY) {
            return;
        }
        const lastIndex = this._count - 1;
        const lastKey = this.keys[lastIndex];
        if (index !== lastIndex) {
            this.items[index] = this.items[lastIndex];
            this.keys[index] = lastKey;
            this.indices[lastKey] = index;
        }
        this.items[lastIndex] = undefined;
        this.keys[lastIndex] = SparseSet.EMPTY;
        this.indices[key] = SparseSet.EMPTY;
        this._count--;
    }

    get(key: number): T | undefined {
        const index = this.indices[key];
        if (index === SparseSet.EMPTY) {
            return undefined;
        }
        return this.items[index];
    }

    has(key: number): boolean {
        return this.indices[key] !== SparseSet.EMPTY;
    }

    forEach(fn: (item: T, key: number, index: number) => void): void {
        for (let i = 0; i < this._count; i++) {
            fn(this.items[i] as T, this.keys[i], i);
        }
    }
}
