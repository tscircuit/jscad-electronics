import { expect, test } from "bun:test"
import { createLeadScrewNutMesh } from "../lib/models/leadscrewnut"
import { sliceMesh, innerRadiusAtAngle } from "./fixtures/assert-gear-geometry"
test("female thread keeps independent minor/root clearance and correct mating kinematics", () => {
  for (const [threadSize, lead, starts] of [
    ["TR8x2", 2, 1],
    ["TR8x8(P2)", 8, 4],
  ] as const)
    for (const threadHand of ["right", "left"] as const) {
      const mesh = createLeadScrewNutMesh({
        threadSize,
        threadHand,
        style: "cylindrical",
        boreChamfer: 0,
      })
      const sign = threadHand === "right" ? 1 : -1,
        z = 6,
        crest = ((sign * z) / lead) * 2 * Math.PI
      const section = sliceMesh(mesh, z)
      expect(innerRadiusAtAngle(section, crest)).toBeCloseTo(4.3, 5)
      expect(innerRadiusAtAngle(section, crest + Math.PI / starts)).toBeCloseTo(
        3.05,
        5,
      )
      expect(
        innerRadiusAtAngle(section, crest + Math.PI / (2 * starts)),
      ).toBeCloseTo(3.55, 5)
      expect(
        innerRadiusAtAngle(
          sliceMesh(mesh, z + 0.5),
          crest + (sign * Math.PI) / (2 * starts),
        ),
      ).toBeCloseTo(4.3, 5)
      // Sample the bore independently of vertices: every mating radial ray clears the external design profile.
      for (let i = 0; i < 96; i++) {
        const angle = (i * Math.PI) / 48
        const phase =
          (((z / 2 - (sign * starts * angle) / (2 * Math.PI)) % 1) + 1) % 1
        const u = Math.min(phase, 1 - phase) * 2
        const male = Math.max(
          2.75,
          Math.min(4, 3.5 + (0.5 - u) / Math.tan(Math.PI / 12)),
        )
        expect(
          innerRadiusAtAngle(section, angle) - male,
        ).toBeGreaterThanOrEqual(0.05 - 1e-9)
      }
    }
  const chamfered = createLeadScrewNutMesh({ threadSize: "TR8x8(P2)" })
  for (const z of [0.001, 14.999])
    expect(innerRadiusAtAngle(sliceMesh(chamfered, z), 0)).toBeCloseTo(4.549, 3)
})
