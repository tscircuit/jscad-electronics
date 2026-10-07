import { add, scale, subtract } from "./path-frames"
import type { CablePoint } from "./types"

/** Add sweep samples on the supplied world-mm polyline, without changing its
 * route. End transitions occupy at most 20 mm each; short cables retain a
 * compact middle third. Sampling the transitions also supports two-point paths.
 */
export function createBundleFanoutPath(path: CablePoint[]) {
  const originalDistances = [0]
  for (let index = 1; index < path.length; index++)
    originalDistances.push(
      originalDistances[index - 1]! +
        Math.hypot(...subtract(path[index]!, path[index - 1]!)),
    )
  const length = originalDistances.at(-1)!
  const endLength = Math.min(20, length / 3)
  const samples = [...originalDistances, length / 2]
  for (let step = 0; step <= 10; step++) {
    const distance = (endLength * step) / 10
    samples.push(distance, length - distance)
  }
  const distances = samples
    .sort((a, b) => a - b)
    .filter(
      (distance, index, sorted) =>
        index === 0 || distance - sorted[index - 1]! > 1e-9,
    )
  let segment = 0
  const sampledPath = distances.map((distance): CablePoint => {
    while (
      segment < path.length - 2 &&
      distance > originalDistances[segment + 1]!
    )
      segment++
    const progress =
      (distance - originalDistances[segment]!) /
      (originalDistances[segment + 1]! - originalDistances[segment]!)
    return add(
      path[segment]!,
      scale(subtract(path[segment + 1]!, path[segment]!), progress),
    )
  })
  return { path: sampledPath, distances, length, endLength }
}
