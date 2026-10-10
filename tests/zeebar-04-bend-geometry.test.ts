import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createZeeBarMesh } from "../lib/models/zeebar"
import { props } from "./fixtures/zeebar"
test("zeebar 4: opposing bends have specified radii and constant thickness", () => {
  const r = props.bendRadius,
    R = r + props.thickness,
    w = props.upperWidth + props.lowerWidth - props.thickness,
    mesh = createZeeBarMesh(props)
  const lower = raySurfaceHits(
    mesh,
    [props.lowerWidth - R - w / 2, R - props.height / 2, props.length / 2],
    [Math.SQRT1_2, -Math.SQRT1_2, 0],
  )
  const upper = raySurfaceHits(
    mesh,
    [
      props.lowerWidth + r - w / 2,
      props.height - R - props.height / 2,
      props.length / 2,
    ],
    [-Math.SQRT1_2, Math.SQRT1_2, 0],
  )
  for (const hits of [lower, upper]) {
    expect(hits).toHaveLength(2)
    expect(hits[0]).toBeCloseTo(r, 8)
    expect(hits[1]).toBeCloseTo(R, 8)
  }
})
