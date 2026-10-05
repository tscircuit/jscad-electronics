import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { flangedBushingModelPropsSchema } from "@tscircuit/modelprinter"
import {
  createFlangedBushingGeom,
  createFlangedBushingMesh,
} from "../lib/FlangedBushing"
import { examples } from "./fixtures/flanged-bushing-cases"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
  sliceMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

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
