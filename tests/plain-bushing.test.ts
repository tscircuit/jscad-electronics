import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  mp,
  plainBushingModelPropsSchema,
  type PlainBushingModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  PlainBushing,
  createPlainBushingGeom,
  createPlainBushingMesh,
} from "../lib/PlainBushing"
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
  "plainbushing_id8mm_od12mm_l20mm_style(plainclosed)_edgechamfer0.5mm"
const examples: PlainBushingModelPropsInput[] = [
  { innerDiameter: 8, outerDiameter: 12, length: 20, edgeChamfer: 0.5 },
  { innerDiameter: "0.25in", outerDiameter: "0.5in", length: "1in" },
  { innerDiameter: 8, outerDiameter: 8.1, length: 0.5, edgeChamfer: 0.02 },
]

for (const input of examples) {
  test(`plain bushing has a closed outward surface and through bore: ${JSON.stringify(input)}`, () => {
    const props = plainBushingModelPropsSchema.parse(input)
    const mesh = createPlainBushingMesh(input)
    const volume = assertClosedGearMesh(mesh)
    const geom = createPlainBushingGeom(input)
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const radii = mesh.positions
      .filter((_, index) => index % 3 === 0)
      .map((x, index) => Math.hypot(x, mesh.positions[index * 3 + 1]!))
    const inner = props.innerDiameter / 2
    const outer = props.outerDiameter / 2
    expect(Math.min(...radii)).toBeCloseTo(inner, 8)
    expect(Math.max(...radii)).toBeCloseTo(outer, 8)
    assertOpenAxialBore(mesh, inner)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[0]).toBeCloseTo(outer, 8)
    expect(bounds.minimum[0]).toBeCloseTo(-outer, 8)
    const height = props.length
    expect(bounds.maximum[2]).toBe(height)
    const chamfer = props.edgeChamfer
    const exact =
      Math.PI * (outer ** 2 - inner ** 2) * height -
      2 * Math.PI * (outer + inner) * chamfer ** 2
    const angularStep = (2 * Math.PI) / 96
    expect(volume).toBeCloseTo((exact * Math.sin(angularStep)) / angularStep, 6)
    for (const z of [height * 0.001, height / 2, height * 0.999]) {
      const cut = sliceMesh(mesh, z)
      const setback = Math.max(0, chamfer - Math.min(z, height - z))
      expect(innerRadiusAtAngle(cut, 0)).toBeCloseTo(inner + setback, 8)
      expect(outerRadiusAtAngle(cut, 0)).toBeCloseTo(outer - setback, 8)
    }
  })
}

test("plain bushing chamfers every bore and outside rim without changing overall length", () => {
  const mesh = createPlainBushingMesh(examples[0]!)
  for (const [z, expected] of [
    [0, [4.5, 5.5]],
    [0.5, [4, 6]],
    [19.5, [4, 6]],
    [20, [4.5, 5.5]],
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
  const square = createPlainBushingMesh({
    innerDiameter: 8,
    outerDiameter: 12,
    length: 20,
  })
  expect(new Set(square.positions.filter((_, i) => i % 3 === 2))).toEqual(
    new Set([0, 20]),
  )
  expect(square.indices.length).toBeLessThan(mesh.indices.length)
})

test("plain bushing shares modelprinter validation without renderer defaults", () => {
  for (const extra of [
    { innerDiameter: 0 },
    { outerDiameter: 8 },
    { edgeChamfer: 1 },
    { length: 1, edgeChamfer: 0.5 },
    { length: Infinity },
    { length: "20mmjunk" },
    { style: "split" },
    { unexpected: 1 },
  ]) {
    const props = { innerDiameter: 8, outerDiameter: 12, length: 20, ...extra }
    expect(() =>
      createPlainBushingMesh(props as PlainBushingModelPropsInput),
    ).toThrow()
    expect(() =>
      createPlainBushingGeom(props as PlainBushingModelPropsInput),
    ).toThrow()
  }
  expect(() => Footprinter3d({ footprint: source + "_id9mm" })).toThrow()
  expect(() =>
    ExtrudedPads({ footprint: "plainbushing_id8mm_od8mm_l20mm" }),
  ).toThrow()
})

test("plain bushing React, footprint routing and vanilla exports agree and create no pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "plainbushing")
    throw new Error("Expected plain bushing")
  const { fn, ...props } = definition
  const vanilla = await importVanilla()
  const geometry = createPlainBushingGeom(props)
  expect(vanilla.createPlainBushingMesh(props)).toEqual(
    createPlainBushingMesh(props),
  )
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  const results = [
    getComponentModel(PlainBushing, props),
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
