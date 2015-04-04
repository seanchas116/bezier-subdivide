(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../index.js":2}],2:[function(require,module,exports){
//----------------------------------------------------------------------------
// Anti-Grain Geometry - Version 2.4
// Copyright (C) 2002-2005 Maxim Shemanarev (http://www.antigrain.com)
//
// Permission to copy, use, modify, sell and distribute this software
// is granted provided this copyright notice appears in all copies.
// This software is provided "as is" without express or implied
// warranty, and with no claim as to its suitability for any purpose.
//
//----------------------------------------------------------------------------
// Contact: mcseem@antigrain.com
//          mcseemagg@yahoo.com
//          http://www.antigrain.com
//----------------------------------------------------------------------------

"use strict";

var assign = require("object-assign");

function calc_sq_distance(x1, y1, x2, y2)
{
  var dx = x2-x1;
  var dy = y2-y1;
  return dx * dx + dy * dy;
}

var curve_recursion_limit = 32;
var curve_angle_tolerance_epsilon = 0.01;
var curve_collinearity_epsilon = 1e-30;

function Subdivision(curve, opts) {
  var x1 = curve[0][0];
  var y1 = curve[0][1];
  var x2 = curve[1][0];
  var y2 = curve[1][1];
  var x3 = curve[2][0];
  var y3 = curve[2][1];
  var x4 = curve[3][0];
  var y4 = curve[3][1];

  var options = {
    approximationScale: 1,
    angleTolerance: 0,
    cuspLimit: 0
  };
  assign(options, opts);

  this.points = [];
  this.approximation_scale = options.approximationScale;
  this.angle_tolerance = options.angleTolerance;
  this.cusp_limit = options.cuspLimit;
  this.distance_tolerance_square = 0.5 / this.approximation_scale;
  this.distance_tolerance_square *= this.distance_tolerance_square;
  this.bezier(x1, y1, x2, y2, x3, y3, x4, y4);
}

Subdivision.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4)
{
  this.points.push([x1, y1]);
  this.recursive_bezier(x1, y1, x2, y2, x3, y3, x4, y4, 0);
  this.points.push([x4, y4]);
};

Subdivision.prototype.recursive_bezier = function(x1, y1, x2, y2, x3, y3, x4, y4, level)
{
  if(level > curve_recursion_limit)
  {
    return;
  }

  // Calculate all the mid-points of the line segments
  //----------------------
  var x12   = (x1 + x2) / 2;
  var y12   = (y1 + y2) / 2;
  var x23   = (x2 + x3) / 2;
  var y23   = (y2 + y3) / 2;
  var x34   = (x3 + x4) / 2;
  var y34   = (y3 + y4) / 2;
  var x123  = (x12 + x23) / 2;
  var y123  = (y12 + y23) / 2;
  var x234  = (x23 + x34) / 2;
  var y234  = (y23 + y34) / 2;
  var x1234 = (x123 + x234) / 2;
  var y1234 = (y123 + y234) / 2;


  // Try to approximate the full cubic curve by a single straight line
  //------------------
  var dx = x4-x1;
  var dy = y4-y1;

  var d2 = Math.abs(((x2 - x4) * dy - (y2 - y4) * dx));
  var d3 = Math.abs(((x3 - x4) * dy - (y3 - y4) * dx));
  var da1, da2, k;

  switch(((d2 > curve_collinearity_epsilon) << 1) +
      (d3 > curve_collinearity_epsilon))
  {
  case 0:
    // All collinear OR p1==p4
    //----------------------
    k = dx*dx + dy*dy;
    if(k == 0)
    {
      d2 = calc_sq_distance(x1, y1, x2, y2);
      d3 = calc_sq_distance(x4, y4, x3, y3);
    }
    else
    {
      k   = 1 / k;
      da1 = x2 - x1;
      da2 = y2 - y1;
      d2  = k * (da1*dx + da2*dy);
      da1 = x3 - x1;
      da2 = y3 - y1;
      d3  = k * (da1*dx + da2*dy);
      if(d2 > 0 && d2 < 1 && d3 > 0 && d3 < 1)
      {
        // Simple collinear case, 1---2---3---4
        // We can leave just two endpoints
        return;
      }
         if(d2 <= 0) d2 = calc_sq_distance(x2, y2, x1, y1);
      else if(d2 >= 1) d2 = calc_sq_distance(x2, y2, x4, y4);
      else             d2 = calc_sq_distance(x2, y2, x1 + d2*dx, y1 + d2*dy);

         if(d3 <= 0) d3 = calc_sq_distance(x3, y3, x1, y1);
      else if(d3 >= 1) d3 = calc_sq_distance(x3, y3, x4, y4);
      else             d3 = calc_sq_distance(x3, y3, x1 + d3*dx, y1 + d3*dy);
    }
    if(d2 > d3)
    {
      if(d2 < this.distance_tolerance_square)
      {
        this.points.push([x2, y2]);
        return;
      }
    }
    else
    {
      if(d3 < this.distance_tolerance_square)
      {
        this.points.push([x3, y3]);
        return;
      }
    }
    break;

  case 1:
    // p1,p2,p4 are collinear, p3 is significant
    //----------------------
    if(d3 * d3 <= this.distance_tolerance_square * (dx*dx + dy*dy))
    {
      if(this.angle_tolerance < curve_angle_tolerance_epsilon)
      {
        this.points.push([x23, y23]);
        return;
      }

      // Angle Condition
      //----------------------
      da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2));
      if(da1 >= Math.PI) da1 = 2*Math.PI - da1;

      if(da1 < this.angle_tolerance)
      {
        this.points.push([x2, y2]);
        this.points.push([x3, y3]);
        return;
      }

      if(this.cusp_limit != 0.0)
      {
        if(da1 > this.cusp_limit)
        {
          this.points.push([x3, y3]);
          return;
        }
      }
    }
    break;

  case 2:
    // p1,p3,p4 are collinear, p2 is significant
    //----------------------
    if(d2 * d2 <= this.distance_tolerance_square * (dx*dx + dy*dy))
    {
      if(this.angle_tolerance < curve_angle_tolerance_epsilon)
      {
        this.points.push([x23, y23]);
        return;
      }

      // Angle Condition
      //----------------------
      da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
      if(da1 >= Math.PI) da1 = 2*Math.PI - da1;

      if(da1 < this.angle_tolerance)
      {
        this.points.push([x2, y2]);
        this.points.push([x3, y3]);
        return;
      }

      if(this.cusp_limit != 0.0)
      {
        if(da1 > this.cusp_limit)
        {
          this.points.push([x2, y2]);
          return;
        }
      }
    }
    break;

  case 3:
    // Regular case
    //-----------------
    if((d2 + d3)*(d2 + d3) <= this.distance_tolerance_square * (dx*dx + dy*dy))
    {
      // If the curvature doesn't exceed the distance_tolerance value
      // we tend to finish subdivisions.
      //----------------------
      if(this.angle_tolerance < curve_angle_tolerance_epsilon)
      {
        this.points.push([x23, y23]);
        return;
      }

      // Angle & Cusp Condition
      //----------------------
      k   = Math.atan2(y3 - y2, x3 - x2);
      da1 = Math.abs(k - Math.atan2(y2 - y1, x2 - x1));
      da2 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - k);
      if(da1 >= Math.PI) da1 = 2*Math.PI - da1;
      if(da2 >= Math.PI) da2 = 2*Math.PI - da2;

      if(da1 + da2 < this.angle_tolerance)
      {
        // Finally we can stop the recursion
        //----------------------
        this.points.push([x23, y23]);
        return;
      }

      if(this.cusp_limit != 0.0)
      {
        if(da1 > this.cusp_limit)
        {
          this.points.push([x2, y2]);
          return;
        }

        if(da2 > this.cusp_limit)
        {
          this.points.push([x3, y3]);
          return;
        }
      }
    }
    break;
  }

  // Continue subdivision
  //----------------------
  this.recursive_bezier(x1, y1, x12, y12, x123, y123, x1234, y1234, level + 1);
  this.recursive_bezier(x1234, y1234, x234, y234, x34, y34, x4, y4, level + 1);
};

module.exports = function subdivide(curve, opts)
{
  return new Subdivision(curve, opts).points;
};

},{"object-assign":3}],3:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}]},{},[1]);
