import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  mp,
  flangedBushingModelPropsSchema,
  type FlangedBushingModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  FlangedBushing,
  createFlangedBushingGeom,
  createFlangedBushingMesh,
} from "../lib/FlangedBushing"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
  sliceMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

const source =
  "flangedbushing_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm_style(plainclosed)"
const examples: FlangedBushingModelPropsInput[] = [
  {
    innerDiameter: 8,
    outerDiameter: 12,
    flangeDiameter: 18,
    length: 15,
    flangeThickness: 2,
  },
  {
    innerDiameter: "0.25in",
    outerDiameter: "0.5in",
    flangeDiameter: "0.75in",
    length: "1in",
    flangeThickness: "0.125in",
  },
  {
    innerDiameter: 8,
    outerDiameter: 8.1,
    flangeDiameter: 8.2,
    length: 0.5,
    flangeThickness: 0.1,
  },
]

for (const input of examples) {
  test(`flanged bushing has one closed surface with an uninterrupted bore: ${JSON.stringify(input)}`, () => {
    const props = flangedBushingModelPropsSchema.parse(input)
    const mesh = createFlangedBushingMesh(input)
    const volume = assertClosedGearMesh(mesh)
    const geom = createFlangedBushingGeom(input)
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    const height = props.length
    expect(bounds.maximum[2]).toBe(height)
    const zLevels = [
      ...new Set(mesh.positions.filter((_, i) => i % 3 === 2)),
    ].sort((a, b) => a - b)
    const thickness = props.flangeThickness
    expect(zLevels).toEqual([0, thickness, height])
    const flangeCut = sliceMesh(mesh, thickness / 2)
    const sleeveCut = sliceMesh(mesh, (thickness + height) / 2)
    const ri = props.innerDiameter / 2
    const rf = props.flangeDiameter / 2
    const ro = props.outerDiameter / 2
    expect(innerRadiusAtAngle(flangeCut, 0)).toBeCloseTo(ri, 8)
    expect(outerRadiusAtAngle(flangeCut, 0)).toBeCloseTo(rf, 8)
    expect(outerRadiusAtAngle(sleeveCut, 0)).toBeCloseTo(ro, 8)
    expect(innerRadiusAtAngle(sleeveCut, 0)).toBeCloseTo(ri, 8)
    expect(rf).toBeGreaterThan(ro)
    expect(ro).toBeGreaterThan(ri)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.minimum[0]).toBeCloseTo(-rf, 8)
    expect(bounds.maximum[0]).toBeCloseTo(rf, 8)
    assertOpenAxialBore(mesh, ri)
    const exact =
      Math.PI *
      ((rf ** 2 - ri ** 2) * thickness +
        (ro ** 2 - ri ** 2) * (height - thickness))
    const angularStep = (2 * Math.PI) / 96
    expect(volume).toBeCloseTo((exact * Math.sin(angularStep)) / angularStep, 6)
    for (const z of [
      height * 0.001,
      thickness * 0.99,
      thickness + (height - thickness) * 0.01,
      height * 0.999,
    ]) {
      const cut = sliceMesh(mesh, z)
      expect(innerRadiusAtAngle(cut, 0)).toBeCloseTo(ri, 8)
      expect(outerRadiusAtAngle(cut, 0)).toBeCloseTo(z < thickness ? rf : ro, 8)
    }
  })
}

test("flanged bushing datum and square shoulder preserve overall length including flange", () => {
  const mesh = createFlangedBushingMesh(examples[0]!)
  expect(meshBounds(mesh).maximum[2]).toBe(15)
  expect(new Set(mesh.positions.filter((_, i) => i % 3 === 2))).toEqual(
    new Set([0, 2, 15]),
  )
  for (const [z, expected] of [
    [0, [4, 9]],
    [2, [6, 9]],
    [15, [4, 6]],
  ] as const) {
    const radii = new Set<number>()
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === z)
        radii.add(
          Number(
            Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!).toFixed(8),
          ),
        )
    expect([...radii].sort((a, b) => a - b)).toEqual([...expected])
  }
  // No separate solid, inner shoulder or cap can obstruct the shared through bore.
  expect(innerRadiusAtAngle(sliceMesh(mesh, 1.999), 0)).toBe(4)
  expect(innerRadiusAtAngle(sliceMesh(mesh, 2.001), 0)).toBe(4)
})

test("flanged bushing consumes modelprinter validation and rejects impossible flange dimensions", () => {
  for (const extra of [
    { innerDiameter: 0 },
    { outerDiameter: 8 },
    { flangeDiameter: 12 },
    { flangeThickness: 0 },
    { flangeThickness: 15 },
    { flangeThickness: 16 },
    { length: Infinity },
    { length: "15mmjunk" },
    { style: "split" },
    { unexpected: 1 },
  ]) {
    const props = {
      innerDiameter: 8,
      outerDiameter: 12,
      flangeDiameter: 18,
      length: 15,
      flangeThickness: 2,
      ...extra,
    }
    expect(() =>
      createFlangedBushingMesh(props as FlangedBushingModelPropsInput),
    ).toThrow()
    expect(() =>
      createFlangedBushingGeom(props as FlangedBushingModelPropsInput),
    ).toThrow()
  }
  expect(() => Footprinter3d({ footprint: source + "_flangeod20mm" })).toThrow()
  expect(() =>
    ExtrudedPads({
      footprint:
        "flangedbushing_id8mm_od12mm_flangeod18mm_l2mm_flangethickness2mm",
    }),
  ).toThrow()
})

test("flanged bushing React, footprint routing and vanilla exports agree without PCB pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "flangedbushing")
    throw new Error("Expected flanged bushing")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  const geometry = createFlangedBushingGeom(props)
  expect(vanilla.createFlangedBushingMesh(props)).toEqual(
    createFlangedBushingMesh(props),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const results = [
    getComponentModel(FlangedBushing, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]
  for (const result of results) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      6,
    )
  }
})
