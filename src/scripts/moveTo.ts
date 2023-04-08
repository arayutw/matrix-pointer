import { Matrix, Position } from "./class"
import { findArroundX } from "./findArround";

export function moveTo(matrix: Matrix, sx: number, sy: number): Position | null {
  if (Array.isArray(matrix)) {
    const ey = matrix.length - 1;

    sx = Math.max(0, sx);
    sy = Math.min(Math.max(0, sy), ey);

    let diff = 0;

    const row = matrix[sy];

    if (row) {
      const position = findArroundX(row, sx, sy);
      if (position) return position;
    }

    while ((sy - diff > 0 || ey > sy + diff)) {
      {
        const ny = sy - ++diff;
        const row = matrix[ny];

        if (row) {
          const position = findArroundX(row, sx, ny);
          if (position) return position;
        }
      }

      {
        const ny = sy + diff;
        const row = matrix[ny];

        if (row) {
          const position = findArroundX(row, sx, ny);
          if (position) return position;
        }
      }
    }
  }

  return null;
}