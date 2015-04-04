subdivide-js
========

Bezier curve subdivision in JavaScript

Based on [Anti-Grain Geometry bezier subdivision](http://antigrain.com/research/adaptive_bezier/)

```javascript
var subdivide = require("subdivide-js");

var curve = [[0, 0], [0, 0.5], [0.5, 1], [1, 1]];
var points = subdivide(curve);
```