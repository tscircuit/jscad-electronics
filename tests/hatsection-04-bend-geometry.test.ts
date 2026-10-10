import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createHatSectionMesh } from "../lib/models/hatsection"
import { props } from "./fixtures/hatsection"
test("hatsection 4: all four bends have specified radii and constant wall", () => {
  const r = props.bendRadius,
    R = r + props.thickness,
    w = props.crownWidth + 2 * props.lipWidth,
    mesh = createHatSectionMesh(props)
  for (const sign of [-1, 1]) {
    const lower = raySurfaceHits(
      mesh,
      [
        sign * (w / 2 - props.lipWidth + r),
        R - props.height / 2,
        props.length / 2,
      ],
      [-sign * Math.SQRT1_2, -Math.SQRT1_2, 0],
    )
    const upper = raySurfaceHits(
      mesh,
      [
        sign * (w / 2 - props.lipWidth - R),
        props.height / 2 - R,
        props.length / 2,
      ],
      [sign * Math.SQRT1_2, Math.SQRT1_2, 0],
    )
    for (const hits of [lower, upper]) {
      expect(hits).toHaveLength(2)
      expect(hits[0]).toBeCloseTo(r, 8)
      expect(hits[1]).toBeCloseTo(R, 8)
    }
  }
})
