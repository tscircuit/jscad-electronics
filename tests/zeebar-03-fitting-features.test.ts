import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createZeeBarMesh } from "../lib/models/zeebar"
import { props } from "./fixtures/zeebar"
test("zeebar 3: flanges extend in opposite directions and center web remains solid", () => {
  const mesh = createZeeBarMesh(props),
    w = props.upperWidth + props.lowerWidth - props.thickness,
    z = props.length / 2
  expect(
    raySurfaceHits(mesh, [-w / 2 + 1, -props.height / 2 - 1, z], [0, 1, 0]),
  ).toHaveLength(2)
  expect(
    raySurfaceHits(mesh, [w / 2 - 1, -props.height / 2 - 1, z], [0, 1, 0]),
  ).toHaveLength(2)
  const centerX = props.lowerWidth - props.thickness / 2 - w / 2
  const hits = raySurfaceHits(mesh, [-w / 2 - 1, 0, z], [1, 0, 0])
  expect(hits).toHaveLength(2)
  expect(hits[1]! - hits[0]!).toBeCloseTo(props.thickness, 8)
  expect(centerX).toBe(0)
})
