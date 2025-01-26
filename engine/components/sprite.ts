import { Component } from "thrix/core";
import { Vec2 } from "thrix/std";

export class Sprite extends Component {
    asset: string;
    anchor: Vec2;

    constructor() {
        super();
        this.asset = "";
        this.anchor = new Vec2(0.5, 0.5);
    }

    withAnchor(x: number, y: number): Sprite {
        this.anchor.set(x, y);
        return this;
    }

    withAsset(key: string): Sprite {
        this.asset = key;
        return this;
    }
}
