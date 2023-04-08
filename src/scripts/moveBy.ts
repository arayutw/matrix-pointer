import { Jump, Loop, Loose, Matrix, Position } from "./class";
import { findArroundX, findArroundY } from "./findArround";
import { findOneDirectionX, findOneDirectionY } from "./findOneDirection";

export function moveBy(matrix: Matrix, startPosition: Position | null, direction: "x" | "y", next: boolean, loop: Loop, loose: Loose, jump: Jump): Position | null {
  if (startPosition) {
    const canLoopX = (true === loop) || (loop && loop.x);
    const canLoopY = (true === loop) || (loop && loop.y);

    const canLooseX = (true === loose) || (loose && loose.x);
    const canLooseY = (true === loose) || (loose && loose.y);

    const canJumpX = (true === jump) || (jump && jump.x);
    const canJumpY = (true === jump) || (jump && jump.y);

    let nx = startPosition.x;
    let ny = startPosition.y;

    let lx: number | null = nx;
    let ly: number | null = ny;

    const ey = matrix.length - 1;

    if ("x" === direction) {
      if (canLooseY) {
        while (true) {
          nx += (next ? 1 : -1);

          const ex = matrix[ny].length - 1;
          const overEnd = nx > ex;
          const overStart = 0 > nx;

          if (overStart || overEnd) {
            if (canLoopX) {
              if (canJumpY) {
                ny += (next ? 1 : -1);

                const overEnd = ny > ey;
                const overStart = 0 > ny;

                if (overStart || overEnd) {
                  if (canLoopY) {
                    if (overEnd) {
                      ny = 0;
                    } else {
                      ny = ey;
                    }
                  } else {
                    ny = ly;
                  }
                }

                ly = ny;
              }

              if (overEnd) {
                nx = 0;
              } else {
                nx = matrix[ny].length - 1;
              }
            } else {
              nx = lx;
            }
          }

          if (nx === lx) return startPosition
          lx = nx

          const position = findArroundY(matrix, nx, ny);
          if (position) return position;

        }

      } else {
        {
          const row = matrix[ny];
          const position = findOneDirectionX(row, startPosition.x + (next ? 1 : -1), ny, next);
          if (position) return position;
        }

        if (!canLoopX) {
          return startPosition
        }

        if (!canJumpY) {
          const position = findOneDirectionX(matrix[ny], null, ny, next);
          return position || startPosition;
        }

        while (true) {
          ny += (next ? 1 : -1);

          const overEnd = ny > ey;
          const overStart = 0 > ny;

          if (overStart || overEnd) {
            if (canLoopY) {
              if (overEnd) {
                ny = 0;
              } else {
                ny = ey;
              }
            } else {
              ny = ly;
            }
          }

          if (ny === ly) return startPosition
          ly = ny

          const position = findOneDirectionX(matrix[ny], null, ny, next);
          if (position) return position;
        }
      }
    } else {
      if (canLooseX) {
        while (true) {
          ny += (next ? 1 : -1);

          const overEnd = ny > ey;
          const overStart = 0 > ny;

          if (overStart || overEnd) {
            if (canLoopY) {
              if (overEnd) {
                ny = 0;
              } else {
                ny = ey;
              }

              if (canJumpX) {
                nx += (next ? 1 : -1);

                const ex = matrix[ny].length - 1;
                const overEnd = nx > ex;
                const overStart = 0 > nx;

                if (overStart || overEnd) {
                  if (canLoopX) {
                    if (overEnd) {
                      nx = 0;
                    } else {
                      nx = ex;
                    }
                  } else {
                    nx = lx;
                  }
                }

                lx = nx;
              }
            } else {
              ny = ly;
            }
          }

          if (ny === ly) return startPosition
          ly = ny

          const position = findArroundX(matrix[ny], nx, ny);
          if (position) return position;
        }
      } else {
        {
          const position = findOneDirectionY(matrix, nx, startPosition.y + (next ? 1 : -1), next);
          if (position) return position;
        }

        if (!canLoopY) {
          return startPosition
        }

        if (!canJumpX) {
          const position = findOneDirectionY(matrix, nx, null, next);
          return position || startPosition;
        }

        while (true) {
          nx += (next ? 1 : -1);

          const row = matrix[ny];
          const ex = row.length - 1;

          const overEnd = nx > ex;
          const overStart = 0 > nx;

          if (overStart || overEnd) {
            if (canLoopX) {
              if (overEnd) {
                nx = 0;
              } else {
                nx = ex;
              }
            } else {
              nx = lx;
            }
          }

          if (nx === lx) return startPosition
          lx = nx

          const position = findOneDirectionY(matrix, nx, null, next);
          if (position) return position;
        }
      }
    }
  }

  return null
}