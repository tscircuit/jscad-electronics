import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  helicalGearModelPropsSchema,
  mp,
  type HelicalGearModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  HelicalGear,
  createHelicalGearGeom,
  createHelicalGearMesh,
} from "../lib/HelicalGear"
import { createSpurGearMesh } from "../lib/SpurGear"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  innerRadiusAtAngle,
  materialArcsAtRadius,
  meshBounds,
  minimumOuterWallRadius,
  outerRadiusAtAngle,
  sliceMesh,
} from "./fixtures/assert-gear-geometry"

const cases: HelicalGearModelPropsInput[] = [
  {},
  {
    toothCount: 16,
    module: "0.05in",
    faceWidth: "0.3in",
    helixAngle: 35,
    handedness: "left",
    boreDiameter: 3,
    hubDiameter: 10,
    hubLength: 3,
    phase: 37,
    backlash: 0.1,
    segmentsPerTooth: 24,
  },
  {
    toothCount: 80,
    module: 0.7,
    pressureAngle: 25,
    helixAngle: 45,
    faceWidth: 4,
    segmentsPerTooth: 32,
  },
  {
    toothCount: 8,
    helixAngle: 60,
    faceWidth: 12,
    segmentsPerTooth: 4,
    segmentsPerTurn: 12,
  },
]

for (const input of cases) {
  test(`helical gear is closed, involute, and twists at its pitch cylinder: ${JSON.stringify(input)}`, () => {
    const props = helicalGearModelPropsSchema.parse(input)
    const mesh = createHelicalGearMesh(input)
    const volume = assertClosedGearMesh(mesh)
    const geom = createHelicalGearGeom(input)
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const pitchRadius = (props.module * props.toothCount) / 2
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(props.faceWidth + props.hubLength)
    expect(bounds.maximumRadius).toBeCloseTo(pitchRadius + props.module, 8)
    const direction = props.handedness === "right" ? 1 : -1
    for (const fraction of [0.137, 0.519, 0.893]) {
      const z = props.faceWidth * fraction
      const slice = sliceMesh(mesh, z)
      const phase =
        (props.phase * Math.PI) / 180 +
        (direction * z * Math.tan((props.helixAngle * Math.PI) / 180)) /
          pitchRadius
      const alpha = (props.pressureAngle * Math.PI) / 180
      const baseRadius = pitchRadius * Math.cos(alpha)
      for (const radius of [pitchRadius, pitchRadius + props.module / 2]) {
        const roll = Math.sqrt((radius / baseRadius) ** 2 - 1)
        const halfAngle =
          ((Math.PI * props.module) / 2 - props.backlash) / (2 * pitchRadius) +
          Math.tan(alpha) -
          alpha -
          (roll - Math.atan(roll))
        const arcs = materialArcsAtRadius(slice, radius)
        expect(arcs).toHaveLength(props.toothCount)
        for (const arc of arcs) {
          const offset = (arc.midpoint - phase) * props.toothCount
          expect(
            Math.abs(Math.atan2(Math.sin(offset), Math.cos(offset))) /
              props.toothCount,
          ).toBeLessThan(0.01)
          expect(Math.abs((arc.width - 2 * halfAngle) * radius)).toBeLessThan(
            props.module * (props.segmentsPerTooth === 4 ? 0.2 : 0.06),
          )
        }
      }
      if (props.boreDiameter > 0) {
        expect(innerRadiusAtAngle(slice, 0.173)).toBeCloseTo(
          props.boreDiameter / 2,
          2,
        )
      }
    }
    if (props.boreDiameter > 0)
      assertOpenAxialBore(mesh, props.boreDiameter / 2)
    if (props.hubLength > 0) {
      const hubSlice = sliceMesh(mesh, props.faceWidth + props.hubLength / 2)
      expect(outerRadiusAtAngle(hubSlice, 0.173)).toBeCloseTo(
        props.hubDiameter / 2,
        2,
      )
    }
  })
}

test("zero helix reproduces the spur mesh exactly, including bore and hub", () => {
  for (const props of [
    {},
    { boreDiameter: 5, hubDiameter: 10, hubLength: 3, phase: 23 },
  ])
    for (const handedness of ["left", "right"] as const)
      expect(
        createHelicalGearMesh({ ...props, helixAngle: 0, handedness }),
      ).toEqual(createSpurGearMesh(props))
})

test("helical thin walls stay outside bores and hubs between axial layers", () => {
  for (const props of [
    { boreDiameter: 21.49 },
    { boreDiameter: 6, hubDiameter: 21.49, hubLength: 2 },
  ]) {
    const mesh = createHelicalGearMesh({
      ...props,
      faceWidth: 1,
      helixAngle: 45,
      segmentsPerTooth: 4,
      segmentsPerTurn: 12,
    })
    assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, props.boreDiameter / 2)
    expect(
      minimumOuterWallRadius(mesh, props.boreDiameter / 2),
    ).toBeGreaterThan(props.boreDiameter / 2)
    const slice = sliceMesh(mesh, 0.413)
    for (let i = 0; i < 128; i++)
      expect(outerRadiusAtAngle(slice, (i * Math.PI) / 64)).toBeGreaterThan(
        Math.max(props.boreDiameter, props.hubDiameter ?? 0) / 2,
      )
  }
})

test("helical geometry bounds allocations and normalizes huge phases", () => {
  for (const props of [
    { faceWidth: 1e12 },
    { helixAngle: 89.9999999 },
    { boreDiameter: 21.5 - 1e-12 },
  ])
    expect(() => createHelicalGearMesh(props)).toThrow(/resolution limit/)
  expect(createHelicalGearMesh({ phase: 1e308 })).toEqual(
    createHelicalGearMesh({ phase: 1e308 % 360 }),
  )
  expect(() => createHelicalGearMesh({ helixAngle: 90 })).toThrow()
})

for (const source of [
  "helicalgear",
  "helicalgear16_m0.05in_w0.3in_ha35_left_bore3_hubdiameter10_hublength3_phase37",
]) {
  test(`${source}: React, model-string routing, and vanilla export agree without pads`, async () => {
    const model = mp.string(source).json()
    if (model.fn !== "helicalgear") throw new Error("Expected helical gear")
    const { fn, ...props } = model
    const geometry = createHelicalGearGeom(props)
    const vanilla = await importVanilla()
    expect(vanilla.createHelicalGearMesh(props)).toEqual(
      createHelicalGearMesh(props),
    )
    const results = [
      getComponentModel(HelicalGear, props),
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
}
