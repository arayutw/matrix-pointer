import { Id, Matrix, Position } from "./class";
import { isId } from "./isId";

export function findArroundX(row: Id[], sx: number, ny: number): Position | null {
  if (Array.isArray(row)) {
    const ex = row.length - 1;
    sx = Math.min(Math.max(0, sx), ex);

    let id = row[sx];

    let diff = 0;
    let nx = sx;

    while (!isId(id) && (sx - diff > 0 || ex > sx + diff)) {
      id = row[nx = sx - ++diff];

      if (!isId(id)) {
        id = row[nx = sx + diff];
      }
    }

    if (isId(id)) {
      return {
        id: id as Id,
        x: nx,
        y: ny,
      }
    }
  }

  return null;
}

export function findArroundY(matrix: Matrix, nx: number, sy: number): Position | null {
  if (Array.isArray(matrix)) {
    const ey = matrix.length - 1;
    sy = Math.min(Math.max(0, sy), ey);

    let id;
    const row = matrix[sy];
    if (row) id = row[nx]

    let diff = 0;
    let ny = sy;

    while (!isId(id) && (sy - diff > 0 || ey > sy + diff)) {
      const row = matrix[ny = sy - ++diff];
      if (row) id = row[nx];

      if (!isId(id)) {
        const row = matrix[ny = sy + diff];
        if (row) id = row[nx];
      }
    }

    if (isId(id)) {
      return {
        id: id as Id,
        x: nx,
        y: ny,
      }
    }
  }

  return null;
}