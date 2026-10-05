import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { cableGrommetModelPropsSchema, mp } from "@tscircuit/modelprinter"
import {
  CableGrommet,
  createCableGrommetGeom,
  createCableGrommetMesh,
} from "../lib/CableGrommet"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  meshBounds,
  minimumOuterWallRadius,
  outerRadiusAtAngle,
  sliceMesh,
} from "./fixtures/assert-gear-geometry"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

const source =
  "cablegrommet_panelhole20mm_id10mm_od24mm_h8mm_groovew3mm_grooved2mm_shape(symmetricring)"
const base = {
  panelHoleDiameter: 20,
  innerDiameter: 10,
  outerDiameter: 24,
  height: 8,
  grooveWidth: 3,
  grooveDepth: 2,
}

for (const [name, input] of [
  ["roadmap example", base],
  [
    "inch dimensions",
    {
      panelHoleDiameter: "1in",
      innerDiameter: "0.5in",
      outerDiameter: "1.2in",
      height: "0.4in",
      grooveWidth: "0.1in",
      grooveDepth: "0.1in",
    },
  ],
  ["thin groove-root wall", { ...base, innerDiameter: 19.99 }],
] as const) {
  test(`grommet ${name}: manifold bore, centered groove and equal flanges`, () => {
    const props = cableGrommetModelPropsSchema.parse(input)
    const mesh = createCableGrommetMesh(input)
    const volume = assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, props.innerDiameter / 2)
    const geometry = createCableGrommetGeom(input)
    jscad.geometries.geom3.validate(geometry)
    expect(jscad.measurements.measureVolume(geometry)).toBeCloseTo(volume, 7)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(-props.height / 2)
    expect(bounds.maximum[2]).toBe(props.height / 2)
    expect(bounds.minimum[0]).toBe(-props.outerDiameter / 2)
    expect(bounds.maximum[1]).toBe(props.outerDiameter / 2)
    const rootRadius = (props.outerDiameter - 2 * props.grooveDepth) / 2
    const boreRadius = props.innerDiameter / 2
    const theoreticalVolume =
      Math.PI *
      ((props.outerDiameter ** 2 / 4 - boreRadius ** 2) *
        (props.height - props.grooveWidth) +
        (rootRadius ** 2 - boreRadius ** 2) * props.grooveWidth)
    expect(Math.abs(volume / theoreticalVolume - 1)).toBeLessThan(0.002)
    expect(minimumOuterWallRadius(mesh, boreRadius)).toBeGreaterThan(boreRadius)
    for (const z of [
      -props.height * 0.4,
      -props.grooveWidth * 0.4,
      0,
      props.grooveWidth * 0.4,
      props.height * 0.4,
    ]) {
      const slice = sliceMesh(mesh, z)
      const expectedRadius =
        Math.abs(z) < props.grooveWidth / 2
          ? rootRadius
          : props.outerDiameter / 2
      for (const angle of [0, 0.17, 1.3, 3.1, 5.4]) {
        expect(
          Math.abs(innerRadiusAtAngle(slice, angle) - boreRadius),
        ).toBeLessThan(boreRadius * 0.001)
        expect(
          Math.abs(outerRadiusAtAngle(slice, angle) - expectedRadius),
        ).toBeLessThan(expectedRadius * 0.001)
      }
    }
    const levels = new Set(mesh.positions.filter((_, index) => index % 3 === 2))
    expect([...levels].sort((a, b) => a - b)).toEqual([
      -props.height / 2,
      -props.grooveWidth / 2,
      props.grooveWidth / 2,
      props.height / 2,
    ])
  })
}

test("grommet renderer rejects invalid contracts and impractical resolution before allocation", () => {
  expect(() =>
    createCableGrommetMesh({ ...base, panelHoleDiameter: 19 }),
  ).toThrow()
  expect(() =>
    createCableGrommetMesh({ ...base, innerDiameter: 20 - 1e-12 }),
  ).toThrow(/resolution limit/)
  for (const radialSegments of [0, 11, 13, 4097, Infinity, 16.5])
    expect(() => createCableGrommetMesh(base, { radialSegments })).toThrow()
  assertClosedGearMesh(createCableGrommetMesh(base, { radialSegments: 12 }))
})

test("grommet React, footprint routing, built vanilla and pad exclusion agree", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "cablegrommet") throw new Error("Expected grommet")
  const { fn, ...props } = definition
  const geometry = createCableGrommetGeom(props)
  expect(
    getComponentModel(ExtrudedPads, { footprint: source }).geometries,
  ).toHaveLength(0)
  const vanilla = await importVanilla()
  expect(typeof vanilla.createCableGrommetMesh).toBe("function")
  expect(typeof vanilla.CableGrommet).toBe("function")
  for (const result of [
    getComponentModel(CableGrommet, props),
    getComponentModel(Footprinter3d, { footprint: source }),
    vanilla.getJscadModelForFootprintWithPads(source, jscad),
  ]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      7,
    )
  }
})
