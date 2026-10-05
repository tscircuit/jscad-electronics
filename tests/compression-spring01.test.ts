import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { compressionSpringModelPropsSchema } from "@tscircuit/modelprinter"
import {
  createCompressionSpringGeom,
  createCompressionSpringMesh,
} from "../lib/models/compressionspring"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { base } from "./fixtures/compression-spring-inputs"

for (const [name, input] of [
  ["right-hand roadmap example", base],
  ["left hand", { ...base, hand: "left" }],
  [
    "inch dimensions",
    {
      outerDiameter: "0.5in",
      wireDiameter: "0.04in",
      freeLength: "1in",
      totalTurns: 5,
    },
  ],
] as const) {
  test(`compression spring ${name}: manifold sweep, open bore and ground ends`, () => {
    const props = compressionSpringModelPropsSchema.parse(input)
    const mesh = createCompressionSpringMesh(input)
    const volume = assertClosedGearMesh(mesh)
    const solid = createCompressionSpringGeom(input)
    jscad.geometries.geom3.validate(solid)
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(volume, 6)
    assertOpenAxialBore(
      mesh,
      (props.outerDiameter - 2 * props.wireDiameter) / 2,
    )
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(props.freeLength)
    expect(bounds.maximumRadius).toBeCloseTo(props.outerDiameter / 2, 9)
    let groundArea = 0
    const endAreas = [0, 0]
    for (let index = 0; index < mesh.indices.length; index += 3) {
      const face = mesh.indices
        .slice(index, index + 3)
        .map((i) => mesh.positions.slice(i * 3, i * 3 + 3))
      for (const [end, z] of [0, props.freeLength].entries())
        if (face.every((point) => point[2] === z)) {
          const [a, b, c] = face
          const signedArea =
            ((b![0]! - a![0]!) * (c![1]! - a![1]!) -
              (b![1]! - a![1]!) * (c![0]! - a![0]!)) /
            2
          expect(end === 0 ? signedArea < 0 : signedArea > 0).toBe(true)
          endAreas[end]! += Math.abs(signedArea)
          groundArea += Math.abs(signedArea)
        }
    }
    expect(groundArea).toBeGreaterThan(props.wireDiameter ** 2)
    expect(endAreas[0]).toBeCloseTo(endAreas[1]!, 8)
    // Radial/axial section sweep has volume pi*r^2 * 2*pi*R*N before grinding.
    const ungroundVolume =
      Math.PI *
      (props.wireDiameter / 2) ** 2 *
      Math.PI *
      (props.outerDiameter - props.wireDiameter) *
      props.totalTurns
    expect(volume).toBeLessThan(ungroundVolume)
    expect(volume).toBeGreaterThan(ungroundVolume * 0.9)
  })
}
