import {
  parseNemaMotorString,
  resolveNemaMotorProps,
  type NemaMotorModelPropsInput,
} from "../lib/utils/nemaMotorParameters"
import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { NEMA8, NEMA17, NEMA23, NemaMotor } from "../lib/NemaMotor"
import { Footprinter3d } from "../lib/Footprinter3d"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

const bounds = (geometries: { geom: jscad.geometries.geom3.Geom3 }[]) =>
  jscad.measurements.measureAggregateBoundingBox(
    ...geometries.map((g) => g.geom),
  )
const materialAt = (
  geometries: { geom: jscad.geometries.geom3.Geom3 }[],
  x: number,
  y: number,
  z: number,
) => {
  const probe = jscad.primitives.cuboid({
    size: [0.1, 0.1, 0.1],
    center: [x, y, z],
  })
  return geometries.reduce(
    (volume, { geom }) =>
      volume +
      jscad.measurements.measureVolume(jscad.booleans.intersect(geom, probe)),
    0,
  )
}

test("NEMA motor mounting patterns and blind / through holes in React and vanilla", async () => {
  const vanilla = await importVanilla()
  for (const [size, Component, width, length, pitch, shaft, depth] of [
    [8, NEMA8, 20.3, 33, 16, 15, 2],
    [17, NEMA17, 42.3, 38, 31, 24, 4.5],
    [23, NEMA23, 56.4, 51, 47.14, 20.6, 5],
  ] as const) {
    const direct = getComponentModel(Component, {})
    const routed = getComponentModel(Footprinter3d, {
      footprint: `nema${size}`,
    })
    const pure = vanilla.getJscadModelForFootprint(`nema${size}`, jscad)
    const withPads = vanilla.getJscadModelForFootprintWithPads(
      `nema${size}`,
      jscad,
    )
    expect(pure.geometries.length).toBe(direct.geometries.length)
    expect(withPads.geometries.length).toBe(pure.geometries.length)
    for (const result of [direct, routed, pure]) {
      const [min, max] = bounds(result.geometries)
      expect(min[0]).toBeCloseTo(-width / 2, 3)
      expect(max[1]).toBeCloseTo(width / 2, 3)
      expect(min[2]).toBeCloseTo(-length - { 8: 2, 17: 3, 23: 4 }[size], 6)
      expect(max[2]).toBeCloseTo(shaft, 6)
      for (const { geom } of result.geometries)
        expect(jscad.measurements.measureVolume(geom)).toBeGreaterThan(0)
      for (const x of [-pitch / 2, pitch / 2])
        for (const y of [-pitch / 2, pitch / 2]) {
          expect(materialAt(result.geometries, x, y, -0.2)).toBeCloseTo(0, 8)
          expect(materialAt(result.geometries, x, y, -depth + 0.2)).toBeCloseTo(
            0,
            8,
          )
          if (size !== 23)
            expect(
              materialAt(result.geometries, x, y, -depth - 0.2),
            ).toBeGreaterThan(0.0009)
          else
            expect(
              materialAt(result.geometries, x, y, -length / 2),
            ).toBeCloseTo(0, 8)
          // Hole radius, not just center, must be correct.
          const radius = { 8: 1, 17: 1.5, 23: 2.5 }[size]
          expect(
            materialAt(result.geometries, x + radius + 0.2, y, -0.2),
          ).toBeGreaterThan(0.0009)
        }
    }
    const geometries: { geom: jscad.geometries.geom3.Geom3 }[] = []
    vanilla
      .createJSCADRenderer(jscad)
      .createJSCADRoot(geometries)
      .render(vanilla.h(vanilla[`NEMA${size}`], {}))
    expect(bounds(geometries)).toEqual(bounds(pure.geometries))
  }
})

test("NEMA shaft flat, round shoulder, tip length, rotation and custom units", async () => {
  const vanilla = await importVanilla()
  for (const angle of [0, 90]) {
    const props = {
      nemaSize: 17 as const,
      shaftLength: "30mm",
      shaftDiameter: "8mm",
      shaftFlatDepth: 1,
      shaftFlatLength: 12,
      shaftFlatAngle: angle,
    }
    const direct = getComponentModel(NemaMotor, props)
    const routed = vanilla.getJscadModelForFootprint(
      `nema17_shaftlength30mm_shaftdiameter8mm_flatdepth1mm_flatlength12mm_flatangle${angle}deg`,
      jscad,
    )
    for (const result of [direct, routed]) {
      const [x, y] = angle === 0 ? [3.6, 0] : [0, 3.6]
      expect(materialAt(result.geometries, x, y, 25)).toBeCloseTo(0, 8)
      expect(materialAt(result.geometries, x, y, 10)).toBeGreaterThan(0.0009)
      expect(materialAt(result.geometries, -x, -y, 25)).toBeGreaterThan(0.0009)
      expect(bounds(result.geometries)[1][2]).toBe(30)
    }
  }
  const round = getComponentModel(NEMA17, { shaftShape: "round" })
  expect(materialAt(round.geometries, 2.2, 0, 20)).toBeGreaterThan(0.0009)
  for (const source of [
    "nema17_holespacing40mm",
    "nema17_shaftlength1mm",
    "nema17_flatdepth3mm",
    "nema17_typo",
  ])
    expect(() => vanilla.getJscadModelForFootprint(source, jscad)).toThrow()
})

test("renderer consumes the modelprinter parameter contract", () => {
  expect(
    parseNemaMotorString("NEMA17_l6cm_shaftdiameter0.25in_flatangle-90deg"),
  ).toMatchObject({
    nemaSize: 17,
    bodyLength: 60,
    shaftDiameter: 6.35,
    shaftFlatAngle: -90,
  })
  expect(
    parseNemaMotorString("nema8_holespacing15.4mm_pilotdiameter16mm"),
  ).toMatchObject({ mountingHoleSpacing: 15.4, pilotDiameter: 16 })
  for (const source of [
    "nema9",
    "nema170",
    "nema17.5",
    "nema17_",
    "nema17_l",
    "nema17_l20_length30",
    "nema17_round_dshaft",
    "nema17_dshaft0",
    "nema17_flatangle",
    "nema17_holedepth6",
  ])
    expect(() => parseNemaMotorString(source)).toThrow()
  for (const props of [
    { nemaSize: "17" },
    { nemaSize: 9 },
    { nemaSize: 17, shaftLength: Infinity },
    { nemaSize: 17, shaftShape: "hex" },
    { nemaSize: 17, mountingHoleThrough: "true" },
    { nemaSize: 17, unknownDimension: 1 },
  ])
    expect(() =>
      resolveNemaMotorProps(props as NemaMotorModelPropsInput),
    ).toThrow()
})
