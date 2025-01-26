export class DisplayResource {
    resizeTo: HTMLElement | Window;
    width: number;
    height: number;
    backgroundColor: number;

    constructor(width = 800, height = 600, backgroundColor = 0x000000, resizeTo: HTMLElement | Window | undefined = window) {
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        this.resizeTo = resizeTo
    }
}
