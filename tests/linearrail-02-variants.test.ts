import { expect, test } from "bun:test"
import {
  linearRailModelPropsSchema,
  getLinearRailMountingHoles,
} from "@tscircuit/modelprinter"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createLinearRailMesh } from "../lib/models/linearrail"
test("generic rail variants and explicit mesh-resolution errors are deterministic", () => {
  for (const props of [
    {
      length: 25,
      holeCount: 1,
      chamfer: 0,
      counterboreDiameter: 0,
      counterboreDepth: 0,
    },
    { width: 15, height: 10, neckWidth: 9, length: 125, holeCount: 5 },
    { width: "1.2cm", height: "0.8cm", length: "0.1m" },
  ]) {
    const mesh = createLinearRailMesh(props)
    assertClosedMesh(mesh)
    expect(createLinearRailMesh(props)).toEqual(mesh)
    const p = linearRailModelPropsSchema.parse(props)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum).toEqual([-p.width / 2, 0, 0])
    expect(bounds.maximum).toEqual([p.width / 2, p.length, p.height])
    for (const hole of getLinearRailMountingHoles(p))
      expect(
        raySurfaceHits(mesh, [hole.center.x, hole.center.y, -1], [0, 0, 1]),
      ).toEqual([])
  }
  expect(
    createLinearRailMesh({ width: "1.2cm", height: "0.8cm", length: "0.1m" }),
  ).toEqual(createLinearRailMesh())
  expect(() => createLinearRailMesh({ holeDiameter: 0.00005 })).toThrow(
    "resolution",
  )
  expect(() => createLinearRailMesh({ length: 80 })).toThrow()
})
