import { expect, test } from "bun:test"
import { createNemaMotorMountMesh } from "../lib/models/nemamotormount"
import { assertClosedShaftMount } from "./fixtures/assert-shaft-mount-geometry"
import { meshBounds } from "./fixtures/assert-gear-geometry"
import { mountDefinition } from "./fixtures/nemamotormount-case"

test("nemamotormount produces one closed outward solid with correct dimensions and removed bore volume", () => {
  for (const size of [17, 23] as const) {
    const { fn, ...p } = mountDefinition(size)
    const mesh = createNemaMotorMountMesh(p)
    const volume = assertClosedShaftMount(mesh)
    const { minimum, maximum } = meshBounds(mesh)
    expect({ minimum, maximum }).toEqual({
      minimum: [-p.width / 2, -p.axisHeight, -p.baseDepth],
      maximum: [p.width / 2, p.height - p.axisHeight, p.thickness],
    })
    const ideal =
      p.width * p.thickness * (p.height + p.baseDepth) -
      Math.PI *
        p.thickness *
        ((p.shaftClearanceDiameter / 2) ** 2 +
          4 * (p.mountingHoleDiameter / 2) ** 2 +
          2 * (p.baseHoleDiameter / 2) ** 2)
    expect(Math.abs(volume - ideal) / ideal).toBeLessThan(0.001)
    expect(volume).toBeLessThan(ideal)
  }
})
