"use strict";

var subdivide = require("../index.js");

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("test-canvas");
  var context = canvas.getContext("2d");

  var curve = [[100, 200], [250, 50], [50, 50], [200, 200]];
  var points = subdivide(curve);

  context.beginPath();
  context.lineWidth = 4;
  context.strokeStyle = "red";
  points.forEach(function (point, i) {
    if (i === 0) {
      context.moveTo(point[0], point[1]);
    } else {
      context.lineTo(point[0], point[1]);
    }
  });
  context.stroke();

  context.lineWidth = 2;
  context.strokeStyle = "grey";
  for (var line of [[curve[0], curve[1]], [curve[2], curve[3]]]) {
    context.beginPath();
    context.moveTo(line[0][0], line[0][1]);
    context.lineTo(line[1][0], line[1][1]);
    context.stroke();
  }

  context.lineWidth = 2;
  context.strokeStyle = "black";
  context.fillStyle = "white";

  for (var point of curve) {
    context.beginPath();
    context.ellipse(point[0], point[1], 5, 5, 0, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }
});
