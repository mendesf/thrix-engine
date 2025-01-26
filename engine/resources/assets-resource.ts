export class AssetsResource {
    readonly assets = new Map<string, string>();

    add(src: string, alias: string): void {
        this.assets.set(alias, src);
    }
}