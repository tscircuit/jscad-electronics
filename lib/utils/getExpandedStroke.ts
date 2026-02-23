interface Point {
  x: number;
  y: number;
}

/**
 * Expands a stroke (line) into a polygon of a given width.
 *
 * @param {Point[]} stroke - An array of points representing the stroke to be expanded.
 *                           Each point is an object with 'x' and 'y' properties.
 * @param {number} width - The width of the expanded stroke.
 * @returns {Point[]} An array of points representing the polygon that surrounds the expanded stroke.
 *                    The points alternate between the "left" and "right" sides of the stroke.
 * @throws {Error} Throws an error if the stroke has fewer than two points.
 *
 * @example
 * const stroke = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }];
 * const width = 0.5;
 * const expandedStroke = getExpandedStroke(stroke, width);
 */
export function getExpandedStroke(
  strokeInput: (Point | [number, number] | number[])[],
  width: number,
): Point[] {
  if (strokeInput.length < 2) {
    throw new Error("Stroke must have at least two points");
  }
  const stroke: Point[] = Array.isArray(strokeInput[0])
    ? (strokeInput as any).map(([x, y]: [number, number]) => ({ x, y }))
    : strokeInput;

  const halfWidth = width / 2;
  const leftSide: Point[] = [];
  const rightSide: Point[] = [];

  function getNormal(p1: Point, p2: Point): Point {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    return { x: -dy / length, y: dx / length };
  }

  function addPoint(point: Point, normal: Point, factor: number) {
    const newPoint = {
      x: point.x + normal.x * halfWidth * factor,
      y: point.y + normal.y * halfWidth * factor,
    };
    if (factor > 0) {
      leftSide.push(newPoint);
    } else {
      rightSide.unshift(newPoint);
    }
  }

  // Handle the first point
  const firstNormal = getNormal(stroke[0]!, stroke[1]!);
  addPoint(stroke[0]!, firstNormal, 1);
  addPoint(stroke[0]!, firstNormal, -1);

  // Handle middle points
  for (let i = 1; i < stroke.length - 1; i++) {
    const prev = stroke[i - 1]!;
    const current = stroke[i]!;
    const next = stroke[i + 1]!;

    const normalPrev = getNormal(prev, current);
    const normalNext = getNormal(current, next);

    // Calculate miter line
    const miterX = normalPrev.x + normalNext.x;
    const miterY = normalPrev.y + normalNext.y;
    const miterLength = Math.sqrt(miterX * miterX + miterY * miterY);

    // Check if miter is too long (sharp corner)
    const miterLimit = 2; // Adjust this value to control when to bevel
    if (miterLength / 2 > miterLimit * halfWidth) {
      // Use bevel join
      addPoint(current, normalPrev, 1);
      addPoint(current, normalNext, 1);
      addPoint(current, normalPrev, -1);
      addPoint(current, normalNext, -1);
    } else {
      // Use miter join
      const scale = 1 / miterLength;
      addPoint(current, { x: miterX * scale, y: miterY * scale }, 1);
      addPoint(current, { x: miterX * scale, y: miterY * scale }, -1);
    }
  }

  // Handle the last point
  const lastNormal = getNormal(
    stroke[stroke.length - 2]!,
    stroke[stroke.length - 1]!,
  );
  addPoint(stroke[stroke.length - 1]!, lastNormal, 1);
  addPoint(stroke[stroke.length - 1]!, lastNormal, -1);

  // Combine left and right sides to form a closed polygon
  return [...leftSide, ...rightSide];
}
