import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createHatSectionMesh } from "../lib/models/hatsection"
import { props } from "./fixtures/hatsection"
test("hatsection 3: crown, two webs, and outward lips retain open underside", () => {
  const mesh = createHatSectionMesh(props),
    w = props.crownWidth + 2 * props.lipWidth,
    z = props.length / 2
  const crown = raySurfaceHits(mesh, [0, -props.height / 2 - 1, z], [0, 1, 0])
  expect(crown).toHaveLength(2)
  expect(crown[0]).toBeCloseTo(props.height - props.thickness + 1, 8)
  expect(crown[1]! - crown[0]!).toBeCloseTo(props.thickness, 8)
  for (const sign of [-1, 1]) {
    const lip = raySurfaceHits(
      mesh,
      [sign * (w / 2 - 1), -props.height / 2 - 1, z],
      [0, 1, 0],
    )
    expect(lip).toHaveLength(2)
    expect(lip[0]).toBeCloseTo(1, 8)
    expect(lip[1]! - lip[0]!).toBeCloseTo(props.thickness, 8)
  }
})
