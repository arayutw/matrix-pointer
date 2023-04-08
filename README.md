# MatrixPointer
This is a library that assists in focusing on any position of a matrix and moving relative or absolute to that position.

## Features
- Written in Typescript
- Has no dependencies (e.g. jquery)
- Lightweight, 1KB
- Supports ES6

## Install
### git
```bash
git clone https://github.com/arayutw/matrix-pointer.git
cd matrix-pointer
npm install
npm run build
```

### npm
```bash
npm install @arayutw/matrix-pointer
```

### CDN
Please find various build files (esm, cjs, umd).
- [unpkg](https://unpkg.com/browse/@arayutw/matrix-pointer/dist/scripts/)
- [jsdelivr](https://cdn.jsdelivr.net/npm/@arayutw/matrix-pointer@latest/dist/scripts/)


## Package
If you plan to use it as a package, it is recommended to use [@arayutw/matrix-pointer-import](https://www.npmjs.com/package/@arayutw/matrix-pointer-import?activeTab=code). It is a minimal project with only TypeScript files that has the same contents as this repository.

```bash
npm install @arayutw/matrix-pointer-import
```

```ts
import MatrixPointer from "@arayutw/matrix-pointer-import";
```

## Demo
Check out the demo to see the possibilities.  
[https://arayutw.github.io/matrix-pointer/demo/](https://arayutw.github.io/matrix-pointer/demo/)

## Usage
### load
#### ESM
```js
import MatrixPointer from "<pathto>/matrix-pointer.esm"
```

#### UMD
```html
<script src="https://unpkg.com/@arayutw/matrix-pointer@latest/dist/scripts/matrix-pointer.js"></script>
```

### initialize
The `matrix` parameter is required.
```js
const mp = new MatrixPointer({
  jump?: Jump
  loop?: Loop
  loose?: Loose
  matrix: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
});
```

### Matrix
Please represent the matrix as a collection of arrays of rows.
```ts
[
  [1, 2, 3], // row
  [4, 5, 6], // row
]
```

You do not need to align the number of elements in each row.
```ts
[
  [1, 2, 3],
  [4],
  [5, 6]
]
```

Please specify a unique ID for each element in the row. The type of the ID is arbitrary, but it needs to be comparable with the `===` operator.
```ts
[
  [1, 2, 3],
  ["A", "B", "C"],
  [HTMLElement, Node, Symbol("a")],
]
```

Duplicate values will cause calculation errors, so please be careful.
```ts
[
  [1, 2, 3],
  [1, 2, 3],
]
```

`null` is special and treated as a blank. Anything other than `null` (such as `undefined`) is not treated as a blank.
```ts
[
  [1, 2, 3],
  [4, null, null],
]
```

A matrix can be specified using a function when it is dynamic.
The function is called at an appropriate timing.
```ts
matrix: () => {
  return [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
}
```

### Loop, Jump, Loose
Options can be defined as boolean values or x and y objects representing horizontal and vertical directions respectively.
```ts
loop: true
loop: false
loop: {
  x: true,
  y: false,
}
```

You can also make changes later.
```
mp.loop = true
```
| name | default | description |
| --- | --- | --- |
| `loop` | `true` | Wrap-around movement is allowed. |
| `jump` | `true` | When moving beyond the edge, move to the next/prev row or column. |
| `loose` | `false` | When the destination is blank, shift the row or column to move. **Depending on the matrix structure, unreachable positions may exist, so please set accordingly.** |

### `moveTo()`
You can move by specifying the x and y array indices or the ID directly. If the movement fails, null will be returned, otherwise a Position object representing the new position information will be returned.
```ts
moveTo(x: number, y: number) => Position | null
moveTo(id: unknown) => Position | null
```
```ts
/*
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
*/

mp.moveTo(1, 2);  // id=8(x=1,y=2)
const newPosition = mp.moveTo(5); // id=5(x=1,y=1)
/*
{
  id: unknown
  x: number
  y: number
}
*/
```

### `moveBy()`
Move relative to the current position. See moveTo() for return value description.
```ts
moveBy(direction: "x"|"y", next: boolean) => Position | null
```
```ts
mp.moveBy("x", false);  // left
mp.moveBy("x", true); // right
mp.moveBy("y", false);  // top
const newPosition = mp.moveBy("y", true); // bottom
```

### `position`
Check current position with position property.
```ts
mp.position: Position | null
```
```ts
/*
{
  id: unknown
  x: number
  y: number
}
*/
```

### `on()`
```js
const handler = (event) => {
  //{
  //  target: MatrixPointer
  //  type: "blur" | "focus"
  //  id: unknown
  //  x: number
  //  y: number
  //}
  console.log(event);
}

a.on("blur", handler, {
  once: false,
});

a.on("focus", handler, {
  once: false,
});
```

### `off()`
```js
mp.off("focus", handler);
```

### `emit()`
```js
mp.emit("click", {
  x: 12,
  y: 34,
});
```

### `destroy`
```js
mp.destroy();
```