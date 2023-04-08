import Emitter from "@arayutw/emitter-import";
export type Id = unknown;
export type Position = {
    id: Id;
    x: number;
    y: number;
};
export type Matrix = Id[][];
type MatrixOption = Matrix | (() => Matrix);
export type Loop = boolean | {
    x: boolean;
    y: boolean;
};
export type Jump = boolean | {
    x: boolean;
    y: boolean;
};
export type Loose = boolean | {
    x: boolean;
    y: boolean;
};
export default class MatrixPointer extends Emitter<MatrixPointer, {
    blur: Position;
    focus: Position;
}> {
    jump: Jump;
    loop: Loop;
    loose: Loose;
    matrix: MatrixOption;
    position: Position | null;
    private readonly caches;
    constructor(options: {
        jump?: Jump;
        loop?: Loop;
        loose?: Loose;
        matrix: MatrixOption;
    });
    private update;
    private focus;
    moveTo(x: number | Id, y?: number): null | Position;
    moveBy(direction: "x" | "y", next: boolean): null | Position;
    destroy(): void;
}
export {};
