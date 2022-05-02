type Point = [number, number];

declare function subdivide(bezierPoints: [Point, Point, Point, Point]): Point[];

export default subdivide;
