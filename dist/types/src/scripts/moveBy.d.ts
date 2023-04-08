import { Jump, Loop, Loose, Matrix, Position } from "./class";
export declare function moveBy(matrix: Matrix, startPosition: Position | null, direction: "x" | "y", next: boolean, loop: Loop, loose: Loose, jump: Jump): Position | null;
