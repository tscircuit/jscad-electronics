import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { plainBushingModelPropsSchema } from "@tscircuit/modelprinter"
import {
  createPlainBushingGeom,
  createPlainBushingMesh,
} from "../lib/models/plainbushing"
import { examples } from "./fixtures/plain-bushing-cases"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
  sliceMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

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
