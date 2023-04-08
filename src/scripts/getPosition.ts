import { Id, Matrix, Position } from "./class";
import { isId } from "./isId";

export function getPosition(matrix: Matrix, id: unknown, fallback: boolean): null | Position {
  let defaultPosition: null | Position = null

  const hasId = isId(id);

  for (let ny = 0; matrix.length > ny; ny++) {
    const row = matrix[ny];

    if (Array.isArray(row)) {
      for (let nx = 0; row.length > nx; nx++) {
        const column = row[nx];

        if (isId(column)) {
          if (!defaultPosition) {
            defaultPosition = {
              id: column as Id,
              x: nx,
              y: ny,
            }

            if (!hasId && fallback) return defaultPosition;
          }

          if (column === id) {
            return {
              id: column as Id,
              x: nx,
              y: ny,
            }
          }
        }
      }
    }
  }

  return fallback ? defaultPosition : null;
}