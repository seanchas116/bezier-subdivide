# bezier-subdivide

[![Build Status](https://travis-ci.org/seanchas116/bezier-subdivide.svg?branch=master)](https://travis-ci.org/seanchas116/bezier-subdivide)

Bezier curve subdivision in JavaScript

Based on [Anti-Grain Geometry bezier subdivision](http://antigrain.com/research/adaptive_bezier/)

## Usage

Points are represented by 2-element arrays.

```javascript
var subdivide = require("bezier-subdivide");

var curve = [
  [100, 200],
  [200, 50],
  [50, 100],
  [200, 200],
];
var points = subdivide(curve); // subdivided points
```

[![https://gyazo.com/f8584661f74872afd5ed33699bca0e5b](https://i.gyazo.com/f8584661f74872afd5ed33699bca0e5b.png)](https://gyazo.com/f8584661f74872afd5ed33699bca0e5b)

### `subdivide(points[, options])`

- `points`: Array of points (start, control point 1, control point 2, end)

## Types

```ts
type Point = [number, number];

interface Options {
  approximationScale?: number;
  angleTolerance?: number;
  cuspLimit?: number;
}

declare function subdivide(
  bezierPoints: [Point, Point, Point, Point],
  options?: Options
): Point[];

export default subdivide;
```
