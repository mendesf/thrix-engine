export class SparseSet<T> {
    readonly indices: Int32Array;
    readonly keys: Int32Array;
    readonly items: Array<T | undefined>;
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

    add(key: number, item: T): void {
        const index = this.indices[key];
        if (index === SparseSet.EMPTY) {
            this.indices[key] = this._count;
            this.keys[this._count] = key;
            this.items[this._count] = item;
            this._count++;
        }
    }

    set(key: number, item: T): void {
        const index = this.indices[key];
        if (index === SparseSet.EMPTY) {
            this.indices[key] = this._count;
            this.keys[this._count] = key;
            this.items[this._count] = item;
            this._count++;
        } else {
            this.items[index] = item;
        }
    }

    remove(key: number): void {
        const index = this.indices[key];
        if (index !== SparseSet.EMPTY) {
            const lastIndex = this._count - 1;
            const lastKey = this.keys[lastIndex];

            this.items[index] = this.items[lastIndex];
            this.keys[index] = lastKey;
            this.indices[lastKey] = index;

            this.indices[key] = SparseSet.EMPTY;
            this._count--;
            this.items[lastIndex] = undefined;
        }
    }

    get(key: number): T | undefined {
        const index = this.indices[key];
        return this.items[index];
    }

    has(key: number): boolean {
        return this.indices[key] !== SparseSet.EMPTY;
    }
}
