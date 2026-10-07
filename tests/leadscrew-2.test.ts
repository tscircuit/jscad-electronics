import { expect, test } from "bun:test"
import { createLeadScrewMesh } from "../lib/models/leadscrew"
import {
  sliceMesh,
  outerRadiusAtAngle,
  materialArcsAtRadius,
} from "./fixtures/assert-gear-geometry"
test("screw section proves30degree flanks, start count and lead-dependent hand/phase", () => {
  for (const [threadSize, lead, starts] of [
    ["TR8x2", 2, 1],
    ["TR8x8(P2)", 8, 4],
  ] as const)
    for (const threadHand of ["right", "left"] as const) {
      const sign = threadHand === "right" ? 1 : -1
      const mesh = createLeadScrewMesh(
        { threadSize, threadHand, length: 16, chamfer: 0 },
        { radialSegments: 128 },
      )
      const z = 6,
        crest = ((sign * z) / lead) * 2 * Math.PI,
        section = sliceMesh(mesh, z)
      expect(outerRadiusAtAngle(section, crest)).toBeCloseTo(4, 5)
      expect(outerRadiusAtAngle(section, crest + Math.PI / starts)).toBeCloseTo(
        2.75,
        5,
      )
      expect(
        outerRadiusAtAngle(section, crest + Math.PI / (2 * starts)),
      ).toBeCloseTo(3.5, 5)
      const upperFlank = outerRadiusAtAngle(
        section,
        crest + (3 * Math.PI) / (8 * starts),
      )
      const lowerFlank = outerRadiusAtAngle(
        section,
        crest + (5 * Math.PI) / (8 * starts),
      )
      expect(upperFlank).toBeCloseTo(3.96650635094611, 6)
      expect(lowerFlank).toBeCloseTo(3.03349364905389, 6)
      expect(
        (2 * Math.atan(0.25 / (upperFlank - lowerFlank)) * 180) / Math.PI,
      ).toBeCloseTo(30, 6)
      const arcs = materialArcsAtRadius(section, 3.5)
      expect(arcs).toHaveLength(starts)
      for (const arc of arcs) expect(arc.width).toBeCloseTo(Math.PI / starts, 2)
      const next = sliceMesh(mesh, z + 0.5),
        advance = (sign * Math.PI) / (2 * starts)
      expect(outerRadiusAtAngle(next, crest + advance)).toBeCloseTo(4, 5)
      expect(outerRadiusAtAngle(next, crest - advance)).toBeCloseTo(2.75, 5)
      // One quarter of the axial pitch lies on the pitch cylinder: flanks cross r=3.5.
      expect(outerRadiusAtAngle(sliceMesh(mesh, z + 0.5), crest)).toBeCloseTo(
        3.5,
        5,
      )
    }
})
