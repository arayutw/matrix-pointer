import { test, expect } from "@jest/globals"
import MatrixPointer from "../src/scripts/index"

const matrixPointer = new MatrixPointer({
  matrix: () => {
    return [
      [11, 12, 13, 14, 15],
      [21, 22, 23, 24, 25],
      [31, 32, 33, 34, 35],
      [41, 42, 43, null, 45],
      [51, 52, null, null, 55],
      [61, null, null, null, 65],
    ];
  }
});

function init() {
  matrixPointer.jump = matrixPointer.loop = matrixPointer.loose = true
}

{
  test("moveTo(x, y)", () => expect(matrixPointer.moveTo(1, 1)?.id).toBe(22));
}

{
  test("moveTo(id)", () => expect(matrixPointer.moveTo(42)?.id).toBe(42));
}

{
  test("moveBy(x, true)", () => {
    matrixPointer.moveTo(52);
    matrixPointer.loose = false;
    expect(matrixPointer.moveBy("x", true)?.id).toBe(55)
  });
}

{
  test("moveBy(x, false)", () => {
    matrixPointer.moveTo(41);
    expect(matrixPointer.moveBy("x", false)?.id).toBe(35)
  });
}

{
  test("jump x", () => {
    matrixPointer.jump = {
      x: false,
      y: true,
    }
    matrixPointer.loose = {
      x: false,
      y: true,
    }
    matrixPointer.moveTo(12);
    expect(matrixPointer.moveBy("y", false)?.id).toBe(52);
    init();
  });
}

{
  test("jump y", () => {
    matrixPointer.jump = {
      x: true,
      y: false,
    }
    matrixPointer.moveTo(41);
    expect(matrixPointer.moveBy("x", false)?.id).toBe(45);
    init();
  });
}

{
  test("loop x", () => {
    matrixPointer.loop = {
      x: false,
      y: true,
    }
    matrixPointer.moveTo(41);
    expect(matrixPointer.moveBy("x", false)?.id).toBe(41);
    init();
  });
}

{
  test("loose x: 1", () => {
    matrixPointer.moveTo(34);
    expect(matrixPointer.moveBy("y", true)?.id).toBe(43);
    init();
  });
}

{
  test("loose x: 2", () => {
    matrixPointer.jump = matrixPointer.loop = true;

    matrixPointer.loose = {
      x: false,
      y: true,
    }

    matrixPointer.moveTo(34);

    expect(matrixPointer.moveBy("y", true)?.id).toBe(15);
    init();
  });
}
