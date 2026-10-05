import { expect, test } from "bun:test"
import {
  assertClosedGearMesh,
  sliceMesh,
  innerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
import { createHexNutMesh } from "../lib/models/hexnut"
import { getHexNutDimensions } from "@tscircuit/modelprinter"

test("hex nut internal helical crests follow the pinned 60-degree profile", () => {
  const input = { metricSize: "M6" as const }
  const d = getHexNutDimensions(input)
  const z = 2.125,
    crest = (z * 2 * Math.PI) / d.threadPitch
  const mesh = createHexNutMesh(input)
  const section = sliceMesh(mesh, z)
  expect(innerRadiusAtAngle(section, crest)).toBeCloseTo(
    d.boreMinorDiameter / 2,
    5,
  )
  expect(innerRadiusAtAngle(section, crest + Math.PI)).toBeCloseTo(
    d.diameter / 2,
    4,
  )
  expect(
    innerRadiusAtAngle(
      sliceMesh(mesh, z + d.threadPitch / 4),
      crest + Math.PI / 2,
    ),
  ).toBeCloseTo(d.boreMinorDiameter / 2, 5)
  const smooth = createHexNutMesh({ ...input, showThreads: false })
  assertClosedGearMesh(smooth)
  expect(smooth.indices.length).toBeLessThan(mesh.indices.length / 5)
  expect(innerRadiusAtAngle(sliceMesh(smooth, d.height / 2), 0)).toBeCloseTo(
    d.boreMinorDiameter / 2,
    6,
  )
})
