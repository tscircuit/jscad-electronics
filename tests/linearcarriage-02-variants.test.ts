import { expect, test } from "bun:test"
import {
  linearCarriageModelPropsSchema,
  getLinearCarriageDimensions,
  getLinearCarriageMountingHoles,
} from "@tscircuit/modelprinter"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createLinearCarriageMesh } from "../lib/models/linearcarriage"
test("generic carriage dimensional variants retain closed channels and mounting floors", () => {
  for (const props of [
    {},
    {
      width: 30,
      length: 60,
      height: 16,
      railWidth: 15,
      railHeight: 10,
      railNeckWidth: 9,
      clearance: 0.2,
      holePitchX: 22,
      holePitchY: 35,
      holeDiameter: 4,
    },
    { railWidth: "1.2cm", railHeight: "0.8cm", clearance: "0.015cm" },
  ]) {
    const mesh = createLinearCarriageMesh(props)
    assertClosedMesh(mesh)
    expect(createLinearCarriageMesh(props)).toEqual(mesh)
    const p = linearCarriageModelPropsSchema.parse(props)
    const d = getLinearCarriageDimensions(p)
    const bounds = meshBounds(mesh)
    for (const [i, value] of [-p.width / 2, -p.length / 2, d.bottom].entries())
      expect(bounds.minimum[i]!).toBeCloseTo(value, 8)
    expect(bounds.maximum).toEqual([p.width / 2, p.length / 2, p.height])
    expect(
      raySurfaceHits(
        mesh,
        [0, -p.length, (d.channelShoulder + d.channelTop) / 2],
        [0, 1, 0],
      ),
    ).toEqual([])
    for (const hole of getLinearCarriageMountingHoles(p)) {
      const hits = raySurfaceHits(
        mesh,
        [hole.center.x, hole.center.y, 0],
        [0, 0, 1],
      )
      expect(hits).toHaveLength(2)
      expect(hits[0]!).toBeCloseTo(d.bottom, 8)
      expect(hits[1]!).toBeCloseTo(p.height - p.holeDepth, 8)
    }
  }
  expect(
    createLinearCarriageMesh({
      railWidth: "1.2cm",
      railHeight: "0.8cm",
      clearance: "0.015cm",
    }),
  ).toEqual(createLinearCarriageMesh())
  expect(() => createLinearCarriageMesh({ clearance: 0.00005 })).toThrow(
    "resolution",
  )
  expect(() => createLinearCarriageMesh({ holeDepth: 5 })).toThrow()
})
