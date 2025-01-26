import { Application, Assets, Container, Renderer, Sprite, Text } from "pixi.js";

export class PixiResource {
    readonly app = new Application<Renderer>();
    readonly sprites = new Container({ isRenderGroup: true });
    readonly texts = new Container({ isRenderGroup: true });
    private indexMap = new Map<string, number>;

    public getSprite(id: string): Sprite | undefined {
        const index = this.indexMap.get(id);
        if (index === undefined) return undefined;
        return this.sprites.getChildAt(index) as Sprite;
    }

    public getText(id: string): Text | undefined {
        const index = this.indexMap.get(id);
        if (index === undefined) return undefined;
        return this.texts.getChildAt(index) as Text;
    }

    public addSprite(sprite: Sprite, id: string): Sprite {
        const child = this.sprites.addChild(sprite);
        this.indexMap.set(id, this.sprites.getChildIndex(child));
        return child;
    }

    public addText(text: Text, id: string): Text {
        const child = this.texts.addChild(text);
        this.indexMap.set(id, this.texts.getChildIndex(child));
        return child;
    }

    public getAsset<T>(key: string): T {
        return Assets.get<T>(key);
    }

    public loadAsset<T>(src: string, alias: string): Promise<T> {
        return Assets.load<T>({ src, alias });
    }
}
