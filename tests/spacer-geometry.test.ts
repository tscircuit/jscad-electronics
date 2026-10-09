import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { spacerModelPropsSchema } from "@tscircuit/modelprinter"
import { createSpacerGeom, createSpacerMesh } from "../lib/models/spacer"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  outerRadiusAtAngle,
  sliceMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

for (const input of [
  { innerDiameter: 3.2, outerDiameter: 6, length: 10, chamfer: 0.3 },
  { innerDiameter: "0.125in", outerDiameter: "0.25in", length: "0.5in" },
  { innerDiameter: 8, outerDiameter: 8.1, length: 0.5, chamfer: 0.02 },
])
  test(`spacer is an outward manifold through sleeve: ${JSON.stringify(input)}`, () => {
    const props = spacerModelPropsSchema.parse(input)
    const mesh = createSpacerMesh(input)
    const volume = assertClosedGearMesh(mesh)
    const geom = createSpacerGeom(input)
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const inner = props.innerDiameter / 2,
      outer = props.outerDiameter / 2
    assertOpenAxialBore(mesh, inner)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(props.length)
    expect(bounds.maximum[0]).toBeCloseTo(outer, 8)
    const exactVolume =
      Math.PI * (outer ** 2 - inner ** 2) * props.length -
      2 * Math.PI * (outer + inner) * props.chamfer ** 2
    const step = (2 * Math.PI) / 96
    expect(volume).toBeCloseTo((exactVolume * Math.sin(step)) / step, 6)
    for (const z of [
      props.length * 0.001,
      props.length / 2,
      props.length * 0.999,
    ]) {
      const cut = sliceMesh(mesh, z)
      const setback = Math.max(0, props.chamfer - Math.min(z, props.length - z))
      expect(innerRadiusAtAngle(cut, 0)).toBeCloseTo(inner + setback, 8)
      expect(outerRadiusAtAngle(cut, 0)).toBeCloseTo(outer - setback, 8)
    }
  })
