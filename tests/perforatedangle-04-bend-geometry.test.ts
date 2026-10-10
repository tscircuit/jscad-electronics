import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createPerforatedAngleMesh } from "../lib/models/perforatedangle"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 4: heel has the specified circular constant-thickness bend", () => {
  const r = props.innerRadius,
    R = r + props.thickness
  const hits = raySurfaceHits(
    createPerforatedAngleMesh(props),
    [R - props.width / 2, R - props.height / 2, props.length / 2],
    [-Math.SQRT1_2, -Math.SQRT1_2, 0],
  )
  expect(hits).toHaveLength(2)
  expect(hits[0]).toBeCloseTo(r, 8)
  expect(hits[1]).toBeCloseTo(R, 8)
})
