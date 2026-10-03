import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getNemaMotorReferencePoints } from "@tscircuit/modelprinter"
import { createNemaMotorWireGeometry } from "../lib/utils/nemaMotorWireGeometry"
import { getComponentModel } from "./helpers/component-model"
import { NemaMotor } from "../lib/NemaMotor"
import { importVanilla } from "./fixtures/importVanilla.js"

test("wire termination geometry follows spec references in React and vanilla", async () => {
  const vanilla = await importVanilla()
  for (const angle of [0, 45, 90, 180, 270]) {
    const props = { nemaSize: 17 as const, wireSideAngle: angle }
    const ref = getNemaMotorReferencePoints(props).wireside
    const wires = createNemaMotorWireGeometry(props)
    expect(wires).toHaveLength(4)
    const tip = {
      x: ref.position.x + 5 * ref.direction.x,
      y: ref.position.y + 5 * ref.direction.y,
      z: ref.position.z,
    }
    const probe = jscad.primitives.cuboid({
      size: [0.2, 0.2, 0.2],
      center: [
        tip.x - ref.direction.y * 0.9,
        tip.y + ref.direction.x * 0.9,
        tip.z,
      ],
    })
    const volume = wires.reduce(
      (sum, { geometry }) =>
        sum +
        jscad.measurements.measureVolume(
          jscad.booleans.intersect(geometry, probe),
        ),
      0,
    )
    expect(volume).toBeGreaterThan(0.007)
    const direct = getComponentModel(NemaMotor, props)
    const rendered = vanilla.getJscadModelForFootprint(
      `nema17_wireangle${angle}deg`,
      jscad,
    )
    expect(rendered.geometries.length).toBe(direct.geometries.length)
    const directBounds = jscad.measurements.measureAggregateBoundingBox(
      ...direct.geometries.map((g) => g.geom),
    )
    const vanillaBounds = jscad.measurements.measureAggregateBoundingBox(
      ...rendered.geometries.map(
        (g: { geom: jscad.geometries.geom3.Geom3 }) => g.geom,
      ),
    )
    for (let side = 0; side < 2; side++)
      for (let axis = 0; axis < 3; axis++)
        expect(vanillaBounds[side]![axis]).toBeCloseTo(
          directBounds[side]![axis]!,
          5,
        )
  }
  expect(
    createNemaMotorWireGeometry({ nemaSize: 17, wireConnection: "none" }),
  ).toHaveLength(0)
  const connector = createNemaMotorWireGeometry({
    nemaSize: 17,
    wireConnection: "jst-ph-6",
  })
  expect(connector).toHaveLength(7)
  const [min, max] = jscad.measurements.measureAggregateBoundingBox(
    ...connector.map((c) => c.geometry),
  )
  expect(max[1] - min[1]).toBeCloseTo(13.9)
  expect(max[2] - min[2]).toBeCloseTo(4.5)
  expect(max[0]).toBeCloseTo(21.15 + 6)
  const reference = getNemaMotorReferencePoints({ nemaSize: 17 }).wireside
    .position
  const contactYs = connector
    .slice(1)
    .map((c) => jscad.measurements.measureCenter(c.geometry)[1])
  expect(contactYs[1]! - contactYs[0]!).toBeCloseTo(2)
  expect(reference.z).toBe(-35.5)
})
