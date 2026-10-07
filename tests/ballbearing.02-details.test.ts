import { expect, test } from "bun:test"
import { getBallBearingDimensions } from "@tscircuit/modelprinter"
import { createBallBearingMesh } from "../lib/models/ballbearing"
import { assertAssembly, rayHits } from "./fixtures/ballbearing-geometry"
import { ballBearingFaceCases } from "./fixtures/ballbearing-face-cases"
import {
  sliceMesh,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
} from "./fixtures/assert-gear-geometry"

test("radial grooves and all nine independent face choices preserve closed surfaces, clear balls and the shaft", () => {
  for (const { top, bottom, input } of ballBearingFaceCases) {
    const d = getBallBearingDimensions(input),
      mesh = createBallBearingMesh(input)
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
    for (const [state, face] of [
      [top, "upper"],
      [bottom, "lower"],
    ] as const) {
      const covers = mesh.parts.filter(
        (part) =>
          (part.name.startsWith("shielded ") ||
            part.name.startsWith("sealed ")) &&
          part.name.endsWith(face),
      )
      expect(covers).toHaveLength(state === "open" ? 0 : 1)
      for (const cover of covers) {
        expect(cover.name).toBe(`${state} ${face}`)
        expect(cover.color).toBe(state === "sealed" ? "#252a30" : "#b5bbc3")
        const heights = cover.mesh.positions.filter((_, i) => i % 3 === 2)
        expect(Math.min(...heights)).toBeGreaterThanOrEqual(
          face === "lower" ? 0 : d.width - d.closureThickness,
        )
        expect(Math.max(...heights)).toBeLessThanOrEqual(
          face === "lower" ? d.closureThickness : d.width,
        )
        expect(
          face === "lower" ? Math.min(...heights) : Math.max(...heights),
        ).toBe(face === "lower" ? 0 : d.width)
        const gapRay = [
          d.pitchRadius * Math.cos(Math.PI / 8),
          d.pitchRadius * Math.sin(Math.PI / 8),
          -1,
        ] as [number, number, number]
        expect(rayHits(cover.mesh, gapRay, [0, 0, 1])).toBe(true)
        expect(rayHits(cover.mesh, [0, 0, -1], [0, 0, 1])).toBe(false)
      }
    }
    expect(rayHits(mesh, [0, 0, -1], [0, 0, 1])).toBe(false)
  }
  expect(
    createBallBearingMesh({}, { segments: 192 }).positions.length,
  ).toBeGreaterThan(createBallBearingMesh().positions.length)
})
