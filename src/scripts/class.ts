import Emitter from "@arayutw/emitter-import"
import { moveTo } from "./moveTo"
import { isId } from "./isId"
import { getPosition } from "./getPosition"
import { moveBy } from "./moveBy"

export type Id = unknown

export type Position = {
  id: Id
  x: number
  y: number
}

export type Matrix = Id[][]

type MatrixOption = Matrix | (() => Matrix)

export type Loop = boolean | {
  x: boolean
  y: boolean
}

export type Jump = boolean | {
  x: boolean
  y: boolean
}

export type Loose = boolean | {
  x: boolean
  y: boolean
}

export default class MatrixPointer extends Emitter<MatrixPointer, {
  blur: Position
  focus: Position
}> {
  jump: Jump
  loop: Loop
  loose: Loose
  matrix: MatrixOption
  position: Position | null = null

  private readonly caches: {
    matrix: Matrix
  } = {
      matrix: [],
    }

  constructor(options: {
    jump?: Jump
    loop?: Loop
    loose?: Loose
    matrix: MatrixOption
  }) {
    super();

    this.jump = undefined !== options.jump ? options.jump : true;
    this.loop = undefined !== options.loop ? options.loop : true;
    this.loose = undefined !== options.loose ? options.loose : false;
    this.matrix = options.matrix;
  }

  private update(): Matrix {
    const matrix = "function" === typeof this.matrix ? this.matrix() : this.matrix;
    return this.caches.matrix = Array.isArray(matrix) ? matrix.filter((row) => Array.isArray(row)).map((row) => row.map((column) => isId(column) ? column : null)) : [];
  }

  private focus(newPosition: Position | null): Position | null {
    const oldPosition = this.position;
    this.position = newPosition;

    if (!((!oldPosition && !newPosition) || (oldPosition?.id === newPosition?.id))) {
      if (oldPosition) this.emit("blur", oldPosition);
      if (newPosition) this.emit("focus", newPosition);
    }

    return newPosition;
  }

  moveTo(x: number | Id, y?: number): null | Position {
    const matrix = this.update();
    return this.focus(("number" === typeof x && "number" === typeof y) ? moveTo(matrix, x, y) : getPosition(matrix, x, false));
  }

  moveBy(direction: "x" | "y", next: boolean): null | Position {
    const matrix = this.update();
    return this.focus(moveBy(matrix, getPosition(matrix, this.position?.id, true), direction, next, this.loop, this.loose, this.jump));
  }

  destroy() {
    this.caches.matrix = [];
    this.off("*");
  }
}

