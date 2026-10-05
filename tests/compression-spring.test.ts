import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  compressionSpringModelPropsSchema,
  getCompressionSpringCenterlinePoint,
  mp,
} from "@tscircuit/modelprinter"
import {
  CompressionSpring,
  createCompressionSpringGeom,
  createCompressionSpringMesh,
} from "../lib/CompressionSpring"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { Footprinter3d } from "../lib/Footprinter3d"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { importVanilla } from "./fixtures/importVanilla.js"
import { getComponentModel } from "./helpers/component-model"

const source =
  "compressionspring_spec(custom)_od8mm_wire1mm_l20mm_turns8_active6_ends(closedground)_hand(right)_state(free)"
const base = {
  outerDiameter: 8,
  wireDiameter: 1,
  freeLength: 20,
  totalTurns: 8,
  activeTurns: 6,
}

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

test("compression spring mesh follows imported pitch changes and radial section frames", () => {
  const mesh = createCompressionSpringMesh(base)
  for (const turn of [0.25, 0.75, 1, 1.25, 3.5, 7, 7.25, 7.75]) {
    const center = getCompressionSpringCenterlinePoint(base, turn)
    const radius = Math.hypot(center.x, center.y)
    const radialX = center.x / radius
    const radialY = center.y / radius
    for (const [radialOffset, zOffset] of [
      [0.5, 0],
      [-0.5, 0],
      [0, 0.5],
      [0, -0.5],
    ]) {
      if (center.z + zOffset! < 0 || center.z + zOffset! > base.freeLength)
        continue
      const point = [
        center.x + radialOffset! * radialX,
        center.y + radialOffset! * radialY,
        center.z + zOffset!,
      ]
      let distance = Infinity
      for (let index = 0; index < mesh.positions.length; index += 3)
        distance = Math.min(
          distance,
          Math.hypot(
            ...point.map(
              (value, axis) => value - mesh.positions[index + axis]!,
            ),
          ),
        )
      expect(distance).toBeLessThan(1e-10)
    }
  }
  const left = createCompressionSpringMesh({ ...base, hand: "left" })
  const key = (x: number, y: number, z: number) =>
    [x, y, z].map((n) => Math.round(n * 1e8)).join(",")
  const reflected = new Set<string>()
  for (let index = 0; index < left.positions.length; index += 3)
    reflected.add(
      key(
        left.positions[index]!,
        -left.positions[index + 1]!,
        left.positions[index + 2]!,
      ),
    )
  for (let index = 0; index < mesh.positions.length; index += 3)
    expect(
      reflected.has(
        key(
          mesh.positions[index]!,
          mesh.positions[index + 1]!,
          mesh.positions[index + 2]!,
        ),
      ),
    ).toBe(true)
})

test("compression spring resolution limits reject excessive or collapsed allocations", () => {
  expect(() =>
    createCompressionSpringMesh({
      ...base,
      totalTurns: 1000000,
      activeTurns: 999998,
      freeLength: 2000000,
    }),
  ).toThrow(/resolution limit/)
  expect(() =>
    createCompressionSpringMesh({ ...base, freeLength: 8 + 1e-12 }),
  ).toThrow(/resolution limit/)
  expect(() =>
    createCompressionSpringMesh({ ...base, activeTurns: 5 }),
  ).toThrow()
  for (const options of [
    { segmentsPerTurn: 15 },
    { segmentsPerTurn: 257 },
    { wireSegments: 7 },
    { wireSegments: 65 },
    { wireSegments: Infinity },
  ])
    expect(() => createCompressionSpringMesh(base, options)).toThrow()
  assertClosedGearMesh(
    createCompressionSpringMesh(base, { segmentsPerTurn: 16, wireSegments: 8 }),
  )
})

test("compression spring direct React, routing and built vanilla agree without pads", async () => {
  const definition = mp.string(source).json()
  if (definition.fn !== "compressionspring") throw new Error("Expected spring")
  const { fn, ...props } = definition
  const geometry = createCompressionSpringGeom(props)
  const vanilla = await importVanilla()
  expect(typeof vanilla.createCompressionSpringMesh).toBe("function")
  expect(typeof vanilla.CompressionSpring).toBe("function")
  expect(
    getComponentModel(ExtrudedPads, { footprint: source }).geometries,
  ).toHaveLength(0)
  for (const result of [
    getComponentModel(CompressionSpring, props),
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
      6,
    )
  }
})
