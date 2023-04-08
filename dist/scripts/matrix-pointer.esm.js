/**!
* matrix-pointer 0.0.1
* MIT License
* Copyright (c) 2023 Yuta Arai
**/
class Emitter {
  constructor() {
    this.Emitter$items = [];
  }
  on(name, handler, options) {
    this.off(name, handler);
    this.Emitter$items.push([name, handler, {
      once: !!(options === null || options === void 0 ? void 0 : options.once)
    }]);
  }
  off(name, handler) {
    for (let a = this.Emitter$items, i = 0; a.length > i; i++) {
      if ("*" === name || a[i][0] === name && a[i][1] === handler) {
        a.splice(i--, 1);
      }
    }
  }
  emit(name, event) {
    this.Emitter$items.forEach(entry => {
      var _a;
      if (name === entry[0]) {
        entry[1](Object.assign(Object.assign({}, event), {
          target: this,
          type: name
        }));
        if ((_a = entry[2]) === null || _a === void 0 ? void 0 : _a.once) this.off(name, entry[1]);
      }
    });
  }
}
function isId(id) {
  return null !== id;
}
function findArroundX(row, sx, ny) {
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
        id,
        x: nx,
        y: ny
      };
    }
  }
  return null;
}
function findArroundY(matrix, nx, sy) {
  if (Array.isArray(matrix)) {
    const ey = matrix.length - 1;
    sy = Math.min(Math.max(0, sy), ey);
    let id;
    const row = matrix[sy];
    if (row) id = row[nx];
    let diff = 0;
    let ny = sy;
    while (!isId(id) && (sy - diff > 0 || ey > sy + diff)) {
      const row2 = matrix[ny = sy - ++diff];
      if (row2) id = row2[nx];
      if (!isId(id)) {
        const row3 = matrix[ny = sy + diff];
        if (row3) id = row3[nx];
      }
    }
    if (isId(id)) {
      return {
        id,
        x: nx,
        y: ny
      };
    }
  }
  return null;
}
function moveTo(matrix, sx, sy) {
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
    while (sy - diff > 0 || ey > sy + diff) {
      {
        const ny = sy - ++diff;
        const row2 = matrix[ny];
        if (row2) {
          const position = findArroundX(row2, sx, ny);
          if (position) return position;
        }
      }
      {
        const ny = sy + diff;
        const row2 = matrix[ny];
        if (row2) {
          const position = findArroundX(row2, sx, ny);
          if (position) return position;
        }
      }
    }
  }
  return null;
}
function getPosition(matrix, id, fallback) {
  let defaultPosition = null;
  const hasId = isId(id);
  for (let ny = 0; matrix.length > ny; ny++) {
    const row = matrix[ny];
    if (Array.isArray(row)) {
      for (let nx = 0; row.length > nx; nx++) {
        const column = row[nx];
        if (isId(column)) {
          if (!defaultPosition) {
            defaultPosition = {
              id: column,
              x: nx,
              y: ny
            };
            if (!hasId && fallback) return defaultPosition;
          }
          if (column === id) {
            return {
              id: column,
              x: nx,
              y: ny
            };
          }
        }
      }
    }
  }
  return fallback ? defaultPosition : null;
}
function findOneDirectionY(matrix, nx, sy, next) {
  if (Array.isArray(matrix)) {
    for (let ey = matrix.length - 1, ny = null === sy ? next ? 0 : ey : sy; next ? ey >= ny : ny >= 0; next ? ny++ : ny--) {
      const row = matrix[ny];
      if (Array.isArray(row)) {
        const column = row[nx];
        if (isId(column)) {
          return {
            id: column,
            x: nx,
            y: ny
          };
        }
      }
    }
  }
  return null;
}
function findOneDirectionX(row, sx, ny, next) {
  if (Array.isArray(row)) {
    for (let ex = row.length - 1, nx = null === sx ? next ? 0 : ex : sx; next ? ex >= nx : nx >= 0; next ? nx++ : nx--) {
      const column = row[nx];
      if (isId(column)) {
        return {
          id: column,
          x: nx,
          y: ny
        };
      }
    }
  }
  return null;
}
function moveBy(matrix, startPosition, direction, next, loop, loose, jump) {
  if (startPosition) {
    const canLoopX = true === loop || loop && loop.x;
    const canLoopY = true === loop || loop && loop.y;
    const canLooseX = true === loose || loose && loose.x;
    const canLooseY = true === loose || loose && loose.y;
    const canJumpX = true === jump || jump && jump.x;
    const canJumpY = true === jump || jump && jump.y;
    let nx = startPosition.x;
    let ny = startPosition.y;
    let lx = nx;
    let ly = ny;
    const ey = matrix.length - 1;
    if ("x" === direction) {
      if (canLooseY) {
        while (true) {
          nx += next ? 1 : -1;
          const ex = matrix[ny].length - 1;
          const overEnd = nx > ex;
          const overStart = 0 > nx;
          if (overStart || overEnd) {
            if (canLoopX) {
              if (canJumpY) {
                ny += next ? 1 : -1;
                const overEnd2 = ny > ey;
                const overStart2 = 0 > ny;
                if (overStart2 || overEnd2) {
                  if (canLoopY) {
                    if (overEnd2) {
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
          if (nx === lx) return startPosition;
          lx = nx;
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
          return startPosition;
        }
        if (!canJumpY) {
          const position = findOneDirectionX(matrix[ny], null, ny, next);
          return position || startPosition;
        }
        while (true) {
          ny += next ? 1 : -1;
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
          if (ny === ly) return startPosition;
          ly = ny;
          const position = findOneDirectionX(matrix[ny], null, ny, next);
          if (position) return position;
        }
      }
    } else {
      if (canLooseX) {
        while (true) {
          ny += next ? 1 : -1;
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
                nx += next ? 1 : -1;
                const ex = matrix[ny].length - 1;
                const overEnd2 = nx > ex;
                const overStart2 = 0 > nx;
                if (overStart2 || overEnd2) {
                  if (canLoopX) {
                    if (overEnd2) {
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
          if (ny === ly) return startPosition;
          ly = ny;
          const position = findArroundX(matrix[ny], nx, ny);
          if (position) return position;
        }
      } else {
        {
          const position = findOneDirectionY(matrix, nx, startPosition.y + (next ? 1 : -1), next);
          if (position) return position;
        }
        if (!canLoopY) {
          return startPosition;
        }
        if (!canJumpX) {
          const position = findOneDirectionY(matrix, nx, null, next);
          return position || startPosition;
        }
        while (true) {
          nx += next ? 1 : -1;
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
          if (nx === lx) return startPosition;
          lx = nx;
          const position = findOneDirectionY(matrix, nx, null, next);
          if (position) return position;
        }
      }
    }
  }
  return null;
}
class MatrixPointer extends Emitter {
  constructor(options) {
    super();
    this.position = null;
    this.caches = {
      matrix: []
    };
    this.jump = void 0 !== options.jump ? options.jump : true;
    this.loop = void 0 !== options.loop ? options.loop : true;
    this.loose = void 0 !== options.loose ? options.loose : true;
    this.matrix = options.matrix;
  }
  update() {
    const matrix = "function" === typeof this.matrix ? this.matrix() : this.matrix;
    return this.caches.matrix = Array.isArray(matrix) ? matrix.filter(row => Array.isArray(row)).map(row => row.map(column => isId(column) ? column : null)) : [];
  }
  focus(newPosition) {
    const oldPosition = this.position;
    this.position = newPosition;
    if (!(!oldPosition && !newPosition || (oldPosition === null || oldPosition === void 0 ? void 0 : oldPosition.id) === (newPosition === null || newPosition === void 0 ? void 0 : newPosition.id))) {
      if (oldPosition) this.emit("blur", oldPosition);
      if (newPosition) this.emit("focus", newPosition);
    }
    return newPosition;
  }
  moveTo(x, y) {
    const matrix = this.update();
    return this.focus("number" === typeof x && "number" === typeof y ? moveTo(matrix, x, y) : getPosition(matrix, x, false));
  }
  moveBy(direction, next) {
    var _a;
    const matrix = this.update();
    return this.focus(moveBy(matrix, getPosition(matrix, (_a = this.position) === null || _a === void 0 ? void 0 : _a.id, true), direction, next, this.loop, this.loose, this.jump));
  }
  destroy() {
    this.caches.matrix = [];
    this.off("*");
  }
}
export { MatrixPointer as default };
