bezier-subdivide
========

Bezier curve subdivision in JavaScript

Based on [Anti-Grain Geometry bezier subdivision](http://antigrain.com/research/adaptive_bezier/)

```javascript
var subdivide = require("bezier-subdivide");

var curve = [[0, 0], [0, 50], [50, 100], [100, 100]];
var points = subdivide(curve);
// [[0,0],[0.09765625,4.6875],[1.23291015625,14.02587890625],...,[100,100]]
```
