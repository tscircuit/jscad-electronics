import { expect, test } from "bun:test"
import {
  assertClosedGearMesh,
  sliceMesh,
  outerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
import { createButtonScrewMesh } from "../lib/ButtonScrew"
import { getButtonScrewDimensions } from "@tscircuit/modelprinter"

test("button screw profile has the documented thread depth, phase, runout and fillet", () => {
  const input = { metricSize: "M3" as const, length: 10 }
  const d = getButtonScrewDimensions(input)
  const mesh = createButtonScrewMesh(input)
  const z = -5.125,
    crest = (2 * Math.PI * (z + input.length)) / d.threadPitch
  const section = sliceMesh(mesh, z)
  expect(outerRadiusAtAngle(section, crest)).toBeCloseTo(d.diameter / 2, 5)
  expect(outerRadiusAtAngle(section, crest + Math.PI)).toBeCloseTo(
    d.threadMinorDiameter / 2,
    4,
  )
  const shifted = sliceMesh(mesh, z + d.threadPitch / 4)
  expect(outerRadiusAtAngle(shifted, crest + Math.PI / 2)).toBeCloseTo(
    d.diameter / 2,
    5,
  )
  const smooth = createButtonScrewMesh({ ...input, showThreads: false })
  assertClosedGearMesh(smooth)
  expect(smooth.indices.length).toBeLessThan(mesh.indices.length / 4)
  const filletZ = -d.underHeadRadius + d.underHeadRadius * Math.sin(Math.PI / 4)
  expect(outerRadiusAtAngle(sliceMesh(smooth, filletZ), 0)).toBeCloseTo(
    d.diameter / 2 +
      d.underHeadRadius -
      d.underHeadRadius * Math.cos(Math.PI / 4),
    6,
  )
  expect(outerRadiusAtAngle(sliceMesh(smooth, -0.5), 0)).toBeCloseTo(
    d.diameter / 2,
    6,
  )
})
