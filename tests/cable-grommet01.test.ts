import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { cableGrommetModelPropsSchema } from "@tscircuit/modelprinter"
import {
  createCableGrommetGeom,
  createCableGrommetMesh,
} from "../lib/models/cablegrommet"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  meshBounds,
  minimumOuterWallRadius,
  outerRadiusAtAngle,
  sliceMesh,
} from "./fixtures/assert-gear-geometry"
import { base } from "./fixtures/cable-grommet-inputs"

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
