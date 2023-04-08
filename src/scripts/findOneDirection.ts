import { Id, Matrix, Position } from "./class";
import { isId } from "./isId";

export function findOneDirectionY(matrix: Matrix, nx: number, sy: number | null, next: boolean): Position | null {
  if (Array.isArray(matrix)) {
    for (let ey = matrix.length - 1, ny = (null === sy ? (next ? 0 : ey) : sy); (next ? ey >= ny : ny >= 0); (next ? ny++ : ny--)) {
      const row = matrix[ny];

      if (Array.isArray(row)) {
        const column = row[nx];

        if (isId(column)) {
          return {
            id: column as Id,
            x: nx,
            y: ny,
          }
        }
      }
    }
  }

  return null;
}

export function findOneDirectionX(row: Id[], sx: number | null, ny: number, next: boolean): Position | null {
  if (Array.isArray(row)) {
    for (let ex = row.length - 1, nx = (null === sx ? (next ? 0 : ex) : sx); (next ? ex >= nx : nx >= 0); (next ? nx++ : nx--)) {
      const column = row[nx];

      if (isId(column)) {
        return {
          id: column as Id,
          x: nx,
          y: ny,
        }
      }
    }
  }

  return null;
}