"use strict";

var subdivide = require("../index.js");

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("test-canvas");
  var context = canvas.getContext("2d");

  var curve = [[0, 0], [0, 50], [50, 100], [100, 100]];
  var points = subdivide(curve);

  context.beginPath();
  points.forEach(function (point, i) {
    if (i === 0) {
      context.moveTo(point[0], point[1]);
    } else {
      context.lineTo(point[0], point[1]);
    }
  });
  context.stroke();
});
