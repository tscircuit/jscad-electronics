import { expect, test } from "bun:test"
import {
  assertClosedGearMesh,
  sliceMesh,
  outerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"
import { createThreadedRodMesh } from "../lib/models/threadedrod"
import { getThreadedRodDimensions } from "@tscircuit/modelprinter"

for (const threadHand of ["right", "left"] as const)
  test(`threaded rod ${threadHand} winding advances by one lead without end runout`, () => {
    const input = {
      metricSize: "M6" as const,
      length: 10,
      threadPitch: 0.75,
      leftHand: threadHand === "left",
      chamfer: 0,
    }
    const d = getThreadedRodDimensions(input)
    const mesh = createThreadedRodMesh(input)
    assertClosedGearMesh(mesh)
    const z = 3.75 + 0.75 / 4,
      sign = threadHand === "right" ? 1 : -1,
      crest = ((sign * z) / d.threadPitch) * 2 * Math.PI
    const section = sliceMesh(mesh, z)
    expect(outerRadiusAtAngle(section, crest)).toBeCloseTo(d.diameter / 2, 5)
    expect(outerRadiusAtAngle(section, crest + Math.PI)).toBeCloseTo(
      d.minorDiameter / 2,
      4,
    )
    expect(
      outerRadiusAtAngle(
        sliceMesh(mesh, z + d.threadPitch / 4),
        crest + (sign * Math.PI) / 2,
      ),
    ).toBeCloseTo(d.diameter / 2, 5)
    expect(
      outerRadiusAtAngle(
        sliceMesh(mesh, z + d.threadPitch / 4),
        crest - (sign * Math.PI) / 2,
      ),
    ).toBeCloseTo(d.minorDiameter / 2, 4)
    const end = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === 0 && mesh.positions[i] !== 0)
        end.push(Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!))
    expect(Math.min(...end)).toBeCloseTo(d.minorDiameter / 2, 6)
  })
