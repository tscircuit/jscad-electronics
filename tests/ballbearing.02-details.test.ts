import { expect, test } from "bun:test"
import { getBallBearingDimensions } from "@tscircuit/modelprinter"
import { createBallBearingMesh } from "../lib/models/ballbearing"
import { assertAssembly, rayHits } from "./fixtures/ballbearing-geometry"
import {
  sliceMesh,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"

test("radial race grooves and rim chamfers are actual surfaces; shield/seal faces remain within width", () => {
  for (const closure of ["open", "shielded", "sealed"] as const) {
    const d = getBallBearingDimensions({ code: "608", closure }),
      mesh = createBallBearingMesh({ code: "608", closure })
    assertAssembly(mesh.parts)
    const inner = mesh.parts.find((part) => part.name === "inner race")!.mesh
    const outer = mesh.parts.find((part) => part.name === "outer race")!.mesh
    const innerMid = sliceMesh(inner, d.midZ),
      outerMid = sliceMesh(outer, d.midZ)
    expect(innerRadiusAtAngle(innerMid, 0)).toBeCloseTo(d.boreRadius, 8)
    expect(outerRadiusAtAngle(innerMid, 0)).toBeCloseTo(
      d.pitchRadius - d.grooveRadius,
      8,
    )
    expect(innerRadiusAtAngle(outerMid, 0)).toBeCloseTo(
      d.pitchRadius + d.grooveRadius,
      8,
    )
    expect(outerRadiusAtAngle(outerMid, 0)).toBeCloseTo(d.outerRadius, 8)
    for (const z of [d.rimChamfer / 2, d.width - d.rimChamfer / 2])
      expect(innerRadiusAtAngle(sliceMesh(inner, z), 0)).toBeCloseTo(
        d.boreRadius + d.rimChamfer / 2,
        8,
      )
    const covers = mesh.parts.filter((part) =>
      part.name.startsWith(closure + " "),
    )
    expect(covers).toHaveLength(closure === "open" ? 0 : 2)
    for (const cover of covers) {
      const heights = cover.mesh.positions.filter((_, i) => i % 3 === 2)
      expect(Math.min(...heights)).toBeGreaterThanOrEqual(0)
      expect(Math.max(...heights)).toBeLessThanOrEqual(d.width)
    }
    expect(rayHits(mesh, [0, 0, -1], [0, 0, 1])).toBe(false)
    const gapRay = [
      d.pitchRadius * Math.cos(Math.PI / 8),
      d.pitchRadius * Math.sin(Math.PI / 8),
      -1,
    ] as [number, number, number]
    // Cage occupies the middle; closures additionally cover their two separate face planes.
    if (closure !== "open")
      for (const cover of covers)
        expect(rayHits(cover.mesh, gapRay, [0, 0, 1])).toBe(true)
  }
  expect(
    createBallBearingMesh({}, { segments: 192 }).positions.length,
  ).toBeGreaterThan(createBallBearingMesh().positions.length)
})
