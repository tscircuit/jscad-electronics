import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  mp,
  spurGearModelPropsSchema,
  wormGearModelPropsSchema,
  type SpurGearModelPropsInput,
  type WormGearModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  SpurGear,
  createSpurGearGeom,
  createSpurGearMesh,
} from "../lib/SpurGear"
import {
  WormGear,
  createWormGearGeom,
  createWormGearMesh,
} from "../lib/WormGear"
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

const tau = 2 * Math.PI
const angleDifference = (a: number, b: number) =>
  Math.atan2(Math.sin(a - b), Math.cos(a - b))

const spurCases: { name: string; input: SpurGearModelPropsInput }[] = [
  { name: "defaults", input: {} },
  {
    name: "inch dimensions, bore, and projecting hub",
    input: {
      toothCount: 16,
      module: "0.05in",
      faceWidth: "0.2in",
      clearance: "0.01in",
      boreDiameter: "0.1in",
      hubDiameter: "0.4in",
      hubLength: "0.1in",
      backlash: "0.002in",
      phase: 37,
      segmentsPerTooth: 24,
    },
  },
  {
    name: "root above the base circle",
    input: {
      toothCount: 80,
      module: 0.7,
      faceWidth: 4,
      pressureAngle: 25,
      clearance: 0.2,
      backlash: 0.08,
      boreDiameter: 3,
      hubDiameter: 30,
      hubLength: 3,
      phase: -17,
      segmentsPerTooth: 32,
    },
  },
  {
    name: "low tooth count and minimum resolution",
    input: { toothCount: 8, segmentsPerTooth: 4, phase: 19 },
  },
]

for (const { name, input } of spurCases) {
  test(`spur gear: ${name} is closed and follows an involute`, () => {
    const props = spurGearModelPropsSchema.parse(input)
    const mesh = createSpurGearMesh(input)
    const meshVolume = assertClosedGearMesh(mesh)
    const geometry = createSpurGearGeom(input)
    jscad.geometries.geom3.validate(geometry)
    expect(jscad.measurements.measureVolume(geometry)).toBeCloseTo(
      meshVolume,
      6,
    )

    const pitchRadius = (props.module * props.toothCount) / 2
    const outsideRadius = pitchRadius + props.module
    const rootRadius = pitchRadius - props.module - props.clearance
    const alpha = (props.pressureAngle * Math.PI) / 180
    const baseRadius = pitchRadius * Math.cos(alpha)
    const thickness = (Math.PI * props.module) / 2 - props.backlash
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(props.faceWidth + props.hubLength)
    expect(bounds.maximumRadius).toBeCloseTo(outsideRadius, 9)
    const slice = sliceMesh(mesh, props.faceWidth * 0.413)
    const phase = (props.phase * Math.PI) / 180

    for (const radius of [pitchRadius, (pitchRadius + outsideRadius) / 2]) {
      const roll = Math.sqrt((radius / baseRadius) ** 2 - 1)
      const halfAngle =
        thickness / (2 * pitchRadius) +
        Math.tan(alpha) -
        alpha -
        (roll - Math.atan(roll))
      const arcs = materialArcsAtRadius(slice, radius)
      expect(arcs).toHaveLength(props.toothCount)
      for (const arc of arcs) {
        // The curve is faceted; tolerance scales with resolution and module.
        const tolerance = props.segmentsPerTooth <= 4 ? 0.18 : 0.02
        expect(
          Math.abs(arc.width * radius - 2 * halfAngle * radius),
        ).toBeLessThan(tolerance * props.module)
        const nearestTooth = Math.round(
          angleDifference(arc.midpoint, phase) / (tau / props.toothCount),
        )
        expect(
          Math.abs(
            angleDifference(
              arc.midpoint,
              phase + (nearestTooth * tau) / props.toothCount,
            ),
          ),
        ).toBeLessThan(1e-7)
      }
    }
    expect(outerRadiusAtAngle(slice, phase)).toBeGreaterThan(
      outsideRadius * 0.99,
    )
    expect(
      outerRadiusAtAngle(slice, phase + Math.PI / props.toothCount),
    ).toBeLessThanOrEqual(rootRadius + 1e-8)
    if (props.boreDiameter > 0) {
      assertOpenAxialBore(mesh, props.boreDiameter / 2)
      for (const angle of [0.17, 1.3, 3.1, 5.4])
        expect(
          Math.abs(innerRadiusAtAngle(slice, angle) - props.boreDiameter / 2),
        ).toBeLessThan(props.boreDiameter * 0.002)
    }
    if (props.hubLength > 0) {
      const hubSlice = sliceMesh(
        mesh,
        props.faceWidth + props.hubLength * 0.413,
      )
      for (const angle of [0.17, 1.3, 3.1, 5.4]) {
        expect(
          Math.abs(outerRadiusAtAngle(hubSlice, angle) - props.hubDiameter / 2),
        ).toBeLessThan(props.hubDiameter * 0.002)
      }
    }
  })
}

const wormCases: { name: string; input: WormGearModelPropsInput }[] = [
  { name: "default right-hand single start", input: {} },
  {
    name: "left-hand two-start with inch dimensions and bore",
    input: {
      module: "0.04in",
      pitchDiameter: "0.5in",
      length: "0.8in",
      starts: 2,
      pressureAngle: 17.5,
      clearance: "0.008in",
      backlash: "0.002in",
      boreDiameter: "0.125in",
      handedness: "left",
      phase: 23,
      radialSegments: 64,
      segmentsPerTurn: 48,
    },
  },
  {
    name: "eight starts at minimum circumferential resolution",
    input: {
      module: 0.8,
      pitchDiameter: 18,
      length: 24,
      starts: 8,
      phase: -11,
      boreDiameter: 4,
      radialSegments: 24,
      segmentsPerTurn: 12,
    },
  },
]

for (const { name, input } of wormCases) {
  test(`worm gear: ${name} has a continuous helix with the specified lead`, () => {
    const props = wormGearModelPropsSchema.parse(input)
    const mesh = createWormGearMesh(input)
    const meshVolume = assertClosedGearMesh(mesh)
    const geometry = createWormGearGeom(input)
    jscad.geometries.geom3.validate(geometry)
    expect(jscad.measurements.measureVolume(geometry)).toBeCloseTo(
      meshVolume,
      6,
    )

    const axialPitch = Math.PI * props.module
    const lead = props.starts * axialPitch
    const outsideRadius = props.pitchDiameter / 2 + props.module
    const rootRadius = props.pitchDiameter / 2 - props.module - props.clearance
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(props.length)
    expect(bounds.maximumRadius).toBeCloseTo(outsideRadius, 9)

    const z1 = props.length * 0.197
    const dz = Math.min(lead * 0.137, props.length * 0.29)
    const slice1 = sliceMesh(mesh, z1)
    const slice2 = sliceMesh(mesh, z1 + dz)
    const direction = props.handedness === "right" ? 1 : -1
    const rotation = (direction * tau * dz) / lead
    const crestAngle =
      (props.phase * Math.PI) / 180 + (direction * tau * z1) / lead
    expect(outerRadiusAtAngle(slice1, crestAngle)).toBeGreaterThan(
      outsideRadius - props.module * 0.1,
    )
    expect(
      outerRadiusAtAngle(slice1, crestAngle + Math.PI / props.starts),
    ).toBeLessThan(rootRadius + props.module * 0.1)
    for (const slice of [slice1, slice2]) {
      const arcs = materialArcsAtRadius(slice, props.pitchDiameter / 2)
      expect(arcs).toHaveLength(props.starts)
      const expectedWidth =
        (((axialPitch / 2 - props.backlash) / axialPitch) * tau) / props.starts
      const widthTolerance = props.radialSegments <= 24 ? 0.25 : 0.07
      for (const arc of arcs)
        expect(Math.abs(arc.width - expectedWidth)).toBeLessThan(
          widthTolerance / props.starts,
        )
    }

    let correctError = 0
    let reversedError = 0
    let pitchInsteadOfLeadError = 0
    const sampleCount = 128
    for (let sample = 0; sample < sampleCount; sample++) {
      const angle = (tau * (sample + 0.37)) / sampleCount
      const original = outerRadiusAtAngle(slice1, angle)
      correctError +=
        (outerRadiusAtAngle(slice2, angle + rotation) - original) ** 2
      reversedError +=
        (outerRadiusAtAngle(slice2, angle - rotation) - original) ** 2
      pitchInsteadOfLeadError +=
        (outerRadiusAtAngle(
          slice2,
          angle + (direction * tau * dz) / axialPitch,
        ) -
          original) **
        2
    }
    correctError = Math.sqrt(correctError / sampleCount)
    reversedError = Math.sqrt(reversedError / sampleCount)
    pitchInsteadOfLeadError = Math.sqrt(pitchInsteadOfLeadError / sampleCount)
    expect(correctError).toBeLessThan(props.module * 0.13)
    expect(reversedError).toBeGreaterThan(correctError * 3)
    if (props.starts > 1)
      expect(pitchInsteadOfLeadError).toBeGreaterThan(correctError * 3)

    const radii = Array.from(
      { length: mesh.positions.length / 3 },
      (_, index) =>
        Math.hypot(mesh.positions[3 * index]!, mesh.positions[3 * index + 1]!),
    ).filter((radius) => radius > (props.boreDiameter / 2 + rootRadius) / 2)
    expect(Math.min(...radii)).toBeCloseTo(rootRadius, 9)
    expect(Math.max(...radii)).toBeCloseTo(outsideRadius, 9)
    if (props.boreDiameter > 0) {
      assertOpenAxialBore(mesh, props.boreDiameter / 2)
      for (const angle of [0.17, 1.3, 3.1, 5.4])
        expect(
          Math.abs(innerRadiusAtAngle(slice1, angle) - props.boreDiameter / 2),
        ).toBeLessThan(props.boreDiameter * 0.006)
    }
  })
}

test("worm meshes reject excessive axial allocation before constructing arrays", () => {
  expect(() => createWormGearMesh({ length: 1e12 })).toThrow(/resolution limit/)
})

for (const input of [
  { boreDiameter: 21.49, faceWidth: 1, segmentsPerTooth: 4, phase: 17 },
  {
    boreDiameter: 6,
    hubDiameter: 21.49,
    hubLength: 2,
    faceWidth: 1,
    segmentsPerTooth: 4,
    phase: 17,
  },
]) {
  test(`spur gear: a ${input.hubDiameter ? "hub" : "bore"} close to the root retains positive walls`, () => {
    const mesh = createSpurGearMesh(input)
    assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, input.boreDiameter / 2)
    const constrainedRadius =
      Math.max(input.boreDiameter, input.hubDiameter ?? 0) / 2
    // Check full projected faces, so a chord that cuts across the hole fails.
    expect(
      minimumOuterWallRadius(mesh, input.boreDiameter / 2),
    ).toBeGreaterThan(input.boreDiameter / 2)
    const slice = sliceMesh(mesh, input.faceWidth * 0.413)
    for (let sample = 0; sample < 256; sample++) {
      const angle = (tau * (sample + 0.37)) / 256
      expect(outerRadiusAtAngle(slice, angle)).toBeGreaterThan(
        constrainedRadius,
      )
      expect(
        outerRadiusAtAngle(slice, angle) - innerRadiusAtAngle(slice, angle),
      ).toBeGreaterThan(0)
    }
  })
}

for (const length of [0.1, 1]) {
  test(`worm gear: root-adjacent bore retains positive walls for length ${length}`, () => {
    const boreDiameter = 7.49
    const mesh = createWormGearMesh({
      boreDiameter,
      length,
      radialSegments: 24,
      segmentsPerTurn: 12,
      phase: 17,
    })
    assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, boreDiameter / 2)
    expect(minimumOuterWallRadius(mesh, boreDiameter / 2)).toBeGreaterThan(
      boreDiameter / 2,
    )
    const slice = sliceMesh(mesh, length * 0.413)
    for (let sample = 0; sample < 256; sample++) {
      const angle = (tau * (sample + 0.37)) / 256
      expect(outerRadiusAtAngle(slice, angle)).toBeGreaterThan(boreDiameter / 2)
      expect(
        outerRadiusAtAngle(slice, angle) - innerRadiusAtAngle(slice, angle),
      ).toBeGreaterThan(0)
    }
  })
}

test("vanishing root clearance rejects impractical refinement before allocation", () => {
  expect(() => createSpurGearMesh({ boreDiameter: 21.5 - 1e-12 })).toThrow(
    /resolution limit/,
  )
  expect(() =>
    createSpurGearMesh({ hubDiameter: 21.5 - 1e-12, hubLength: 1 }),
  ).toThrow(/resolution limit/)
  expect(() =>
    createWormGearMesh({ boreDiameter: 7.499999, length: 0.1 }),
  ).toThrow(/resolution limit/)
})

test("huge finite phases are normalized before converting degrees to radians", () => {
  const phase = 1e308
  const reducedPhase = phase % 360
  for (const [actual, expected] of [
    [
      createSpurGearMesh({ phase }),
      createSpurGearMesh({ phase: reducedPhase }),
    ],
    [
      createWormGearMesh({ phase, length: 1 }),
      createWormGearMesh({ phase: reducedPhase, length: 1 }),
    ],
  ]) {
    assertClosedGearMesh(actual!)
    expect(actual!.positions).toEqual(expected!.positions)
    expect(actual!.indices).toEqual(expected!.indices)
  }
})

for (const source of [
  "spurgear",
  "spurgear16_m0.05in_w0.2in_bore0.1in_hubdiameter0.4in_hublength0.1in_phase37_segments24",
  "wormgear",
  "wormgear_m0.8_d12_l18_starts2_left_bore3_phase23_segments64_turnsegments48",
]) {
  test(`${source}: direct React, footprint routing, and built vanilla agree`, async () => {
    const { fn, ...props } = mp.string(source).json()
    const geometry =
      fn === "spurgear"
        ? createSpurGearGeom(props as SpurGearModelPropsInput)
        : createWormGearGeom(props as WormGearModelPropsInput)
    const direct =
      fn === "spurgear"
        ? getComponentModel(SpurGear, props as SpurGearModelPropsInput)
        : getComponentModel(WormGear, props as WormGearModelPropsInput)
    const routed = getComponentModel(Footprinter3d, { footprint: source })
    const vanilla = await importVanilla()
    const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
    const expectedBounds = jscad.measurements.measureBoundingBox(geometry)
    const expectedVolume = jscad.measurements.measureVolume(geometry)
    for (const result of [direct, routed, built]) {
      expect(result.geometries).toHaveLength(1)
      const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
      jscad.geometries.geom3.validate(solid)
      expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
        expectedBounds,
      )
      expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
        expectedVolume,
        6,
      )
    }
  })
}
