import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { NEMA23 } from "../lib/NemaMotor"
import { createNemaMotorSections } from "../lib/utils/nemaMotorGeometry"
import { createNemaMotorWireGeometry } from "../lib/utils/nemaMotorWireGeometry"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

type Geometry = { geom: jscad.geometries.geom3.Geom3 }

test("NEMA23 wires leave the front sidewall without moving the cap or rear bores", () => {
  const wires = createNemaMotorWireGeometry({ nemaSize: 23 })
  expect(wires).toHaveLength(4)
  const [min, max] = jscad.measurements.measureAggregateBoundingBox(
    ...wires.map(({ geometry }) => geometry),
  )
  expect(min[0]).toBeCloseTo(-3.3, 5)
  expect(max[0]).toBeCloseTo(3.3, 5)
  expect(min[1]).toBeCloseTo(-34.2, 5)
  expect(max[1]).toBeCloseTo(-28.05, 5)
  expect(min[2]).toBeCloseTo(-49.1, 5)
  expect(max[2]).toBeCloseTo(-47.9, 5)

  const sections = createNemaMotorSections({ nemaSize: 23 })
  expect(sections).toEqual(
    createNemaMotorSections({ nemaSize: 23, wireSideAngle: 0 }),
  )
  const rear = sections.find(
    (section) => section.name === "rearCap" && section.holes.length,
  )!
  const centers = rear.holes.map((outline) =>
    [0, 1].map((axis) =>
      Number(
        (
          outline.reduce((sum, point) => sum + point[axis]!, 0) / outline.length
        ).toFixed(5),
      ),
    ),
  )
  expect(centers).toEqual([
    [-25, -16],
    [-25, 16],
    [25, -16],
    [25, 16],
  ])
})

test("React and vanilla retain NEMA23 screw axes and honor an explicit side exit", async () => {
  const vanilla = await importVanilla()
  for (const [source, props] of [
    ["nema23", {}],
    ["nema23_wireangle0deg", { wireSideAngle: 0 }],
  ] as const) {
    const direct = getComponentModel(NEMA23, props)
    const routed = vanilla.getJscadModelForFootprint(source, jscad) as {
      geometries: Geometry[]
    }
    const bounds = [direct, routed].map(({ geometries }) =>
      jscad.measurements.measureAggregateBoundingBox(
        ...geometries.map(({ geom }) => geom),
      ),
    )
    for (let side = 0; side < 2; side++)
      for (let axis = 0; axis < 3; axis++)
        expect(bounds[0]![side]![axis]).toBeCloseTo(bounds[1]![side]![axis]!, 5)
    expect(bounds[0]![0][1]).toBeCloseTo(source === "nema23" ? -34.2 : -28.2, 5)
    expect(bounds[0]![1][0]).toBeCloseTo(source === "nema23" ? 28.2 : 34.2, 5)

    for (const { geometries } of [direct, routed]) {
      const screws = geometries
        .map(({ geom }) => jscad.measurements.measureBoundingBox(geom))
        .filter(([min]) => min[2] < -51.1)
        .map(([min, max]) => [
          Number(((min[0] + max[0]) / 2).toFixed(5)),
          Number(((min[1] + max[1]) / 2).toFixed(5)),
        ])
      expect(screws).toEqual([
        [-25, -16],
        [-25, 16],
        [25, -16],
        [25, 16],
      ])
    }
  }
})
