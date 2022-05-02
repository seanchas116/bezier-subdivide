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
