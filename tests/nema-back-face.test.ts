import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { NemaMotor } from "../lib/NemaMotor"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"

type Geometry = { geom: jscad.geometries.geom3.Geom3 }
const materialAt = (
  geometries: Geometry[],
  x: number,
  y: number,
  z: number,
) => {
  const probe = jscad.primitives.cuboid({
    size: [0.1, 0.1, 0.1],
    center: [x, y, z],
  })
  return geometries.reduce((volume, { geom }) => {
    const [min, max] = jscad.measurements.measureBoundingBox(geom)
    if (
      [x, y, z].some(
        (coordinate, axis) =>
          coordinate + 0.05 < min[axis]! || coordinate - 0.05 > max[axis]!,
      )
    )
      return volume
    return (
      volume +
      jscad.measurements.measureVolume(jscad.booleans.intersect(geom, probe))
    )
  }, 0)
}

for (const [
  size,
  length,
  pitch,
  pitchY,
  radius,
  depth,
  headRadius,
  headHeight,
  socketWidth,
] of [
  [8, 33, 16, 16, 1, 2, 1.9, 2, 1.5],
  [17, 38, 31, 31, 1.5, 4.5, 2.75, 3, 2.5],
  [23, 51, 50, 32, 1.5, 4.5, 2.75, 3, 2.5],
  [34, 80, 40, 40, 2.5, 6, 4.25, 5, 4],
] as const) {
  test(`NEMA${size} rear bores and installed screws match in React and vanilla`, async () => {
    const vanilla = await importVanilla()
    for (const mode of ["holes", "screws"] as const) {
      const direct = getComponentModel(NemaMotor, {
        nemaSize: size,
        ...(mode === "holes"
          ? { backFaceHoles: true }
          : mode === "screws"
            ? { backFaceScrews: true }
            : { backFacePlain: true }),
      })
      const routed = vanilla.getJscadModelForFootprint(
        `nema${size}_backface${mode}`,
        jscad,
      )
      for (const { geometries } of [direct, routed]) {
        const bounds = jscad.measurements.measureAggregateBoundingBox(
          ...geometries.map((g: Geometry) => g.geom),
        )
        expect(bounds[0][2]).toBeCloseTo(
          -length - (mode === "screws" ? headHeight : 0),
          5,
        )
        for (const x of [-pitch / 2, pitch / 2])
          for (const y of [-pitchY / 2, pitchY / 2]) {
            // Bore opens on -Z, stays open nearly to its depth, and has a real floor.
            for (const z of [-length + 0.2, -length + depth - 0.2])
              if (mode === "holes")
                expect(materialAt(geometries, x, y, z)).toBeCloseTo(0, 8)
              else
                expect(materialAt(geometries, x, y, z)).toBeGreaterThan(0.0009)
            expect(
              materialAt(geometries, x, y, -length + depth + 0.2),
            ).toBeGreaterThan(0.0009)
            expect(
              materialAt(geometries, x + radius + 0.2, y, -length + 0.2),
            ).toBeGreaterThan(0.0009)
            // The head faces outwards, with a blind hex socket and solid socket floor.
            if (mode === "screws") {
              expect(
                materialAt(geometries, x, y, -length - headHeight + 0.2),
              ).toBeCloseTo(0, 8)
              expect(
                materialAt(
                  geometries,
                  x + headRadius - 0.3,
                  y,
                  -length - headHeight / 2,
                ),
              ).toBeGreaterThan(0.0009)
              expect(
                materialAt(
                  geometries,
                  x + headRadius + 0.2,
                  y,
                  -length - headHeight / 2,
                ),
              ).toBeCloseTo(0, 8)
              expect(
                materialAt(geometries, x, y, -length - 0.2),
              ).toBeGreaterThan(0.0009)
              expect(
                materialAt(
                  geometries,
                  x + socketWidth / 2 + 0.2,
                  y,
                  -length - headHeight + 0.2,
                ),
              ).toBeGreaterThan(0.0009)
            }
          }
      }
    }
  }, 30_000)
}

test("rear custom pitch, bore and screw size leave the front mounting holes unchanged", async () => {
  const vanilla = await importVanilla()
  const { geometries } = vanilla.getJscadModelForFootprint(
    "nema17_backfacescrews_backholespacing24mm_backholediameter2.8mm_backholedepth3mm_backscrewm2.5",
    jscad,
  )
  expect(materialAt(geometries, 12, 12, -38.2)).toBeGreaterThan(0.0009)
  expect(materialAt(geometries, 15.5, 15.5, -38.2)).toBeCloseTo(0, 8)
  expect(materialAt(geometries, 15.5, 15.5, -0.2)).toBeCloseTo(0, 8)
  expect(materialAt(geometries, 12, 12, -0.2)).toBeGreaterThan(0.0009)
  const plain = vanilla.getJscadModelForFootprint("nema17_plainbackface", jscad)
  expect(materialAt(plain.geometries, 15.5, 15.5, -37.8)).toBeGreaterThan(
    0.0009,
  )
})

test("NEMA23 rear recesses and rounded tabs leave the front flange unchanged in every rear mode", async () => {
  const vanilla = await importVanilla()
  for (const mode of ["holes", "screws", "plain"] as const) {
    const props =
      mode === "plain"
        ? { backFacePlain: true }
        : mode === "holes"
          ? { backFaceHoles: true }
          : { backFaceScrews: true }
    const direct = getComponentModel(NemaMotor, {
      nemaSize: 23,
      noWires: true,
      ...props,
    })
    const routed = vanilla.getJscadModelForFootprint(
      `nema23_nowires_${mode === "plain" ? "plainbackface" : `backface${mode}`}`,
      jscad,
    )
    for (const { geometries } of [direct, routed]) {
      expect(materialAt(geometries, 25.5, 25.5, -1)).toBeGreaterThan(0.0009)
      expect(materialAt(geometries, 25.5, 25.5, -50)).toBeCloseTo(0, 8)
      expect(materialAt(geometries, 20, 20, -50)).toBeGreaterThan(0.0009)
      expect(materialAt(geometries, 21, 21, -50)).toBeCloseTo(0, 8)
      expect(materialAt(geometries, 27, 16, -50)).toBeGreaterThan(0.0009)
      expect(materialAt(geometries, 18.9, 27.9, -50)).toBeCloseTo(0, 8)
      expect(materialAt(geometries, 18.1, 27.1, -50)).toBeGreaterThan(0.0009)
      expect(materialAt(geometries, 23.57, 23.57, -0.2)).toBeCloseTo(0, 8)
    }
  }
}, 30_000)

test("NEMA23 rectangular overrides move rear bores without moving the front holes", async () => {
  const vanilla = await importVanilla()
  const direct = getComponentModel(NemaMotor, {
    nemaSize: 23,
    noWires: true,
    backFaceHoles: true,
    backFaceHoleSpacingX: 46,
    backFaceHoleSpacingY: 28,
  })
  const routed = vanilla.getJscadModelForFootprint(
    "nema23_nowires_backfaceholes_backholespacingx46mm_backholespacingy28mm",
    jscad,
  )
  for (const { geometries } of [direct, routed]) {
    expect(materialAt(geometries, 23, 14, -50)).toBeCloseTo(0, 8)
    expect(materialAt(geometries, 25, 16, -50)).toBeGreaterThan(0.0009)
    expect(materialAt(geometries, 23.57, 23.57, -0.2)).toBeCloseTo(0, 8)
  }
}, 30_000)

test("NEMA34 rear cap clears the front flange corners in every rear mode", async () => {
  const vanilla = await importVanilla()
  for (const mode of ["holes", "screws", "plain"] as const) {
    const direct = getComponentModel(NemaMotor, {
      nemaSize: 34,
      ...(mode === "holes"
        ? { backFaceHoles: true }
        : mode === "screws"
          ? { backFaceScrews: true }
          : { backFacePlain: true }),
    })
    const routed = vanilla.getJscadModelForFootprint(
      `nema34_${mode === "plain" ? "plainbackface" : `backface${mode}`}`,
      jscad,
    )
    for (const { geometries } of [direct, routed]) {
      // The front flange retains its corners; the rear cap cuts them away.
      expect(materialAt(geometries, 38, 38, -1)).toBeGreaterThan(0.0009)
      expect(materialAt(geometries, 38, 38, -79)).toBeCloseTo(0, 8)
      expect(materialAt(geometries, 34.8, 34.8, -82.5)).toBeCloseTo(0, 8)
      expect(materialAt(geometries, 20, 34, -79)).toBeGreaterThan(0.0009)
    }
  }
}, 30_000)

test("NEMA34 photo features have rounded shoulder reliefs and recessed front screws", async () => {
  const vanilla = await importVanilla()
  const direct = getComponentModel(NemaMotor, {
    nemaSize: 34,
    noWires: true,
  })
  const routed = vanilla.getJscadModelForFootprint("nema34_nowires", jscad)
  for (const { geometries } of [direct, routed]) {
    // A diagonal bevel would fill this point; the stepped shoulder cuts it out.
    expect(materialAt(geometries, 32, 32, -40)).toBeCloseTo(0, 8)
    expect(materialAt(geometries, 25, 36, -40)).toBeGreaterThan(0.0009)
    expect(materialAt(geometries, 32, 32, -79)).toBeCloseTo(0, 8)
    // Recessed Phillips head, cross recess, and casting floor below the recess.
    const x = 39.5,
      y = 86 * 0.26
    expect(materialAt(geometries, x, y, -0.6)).toBeCloseTo(0, 8)
    expect(materialAt(geometries, x + 1.5, y + 1.5, -1)).toBeGreaterThan(0.0009)
    expect(materialAt(geometries, 42.8, y, -1)).toBeCloseTo(0, 8)
    expect(materialAt(geometries, 42.8, y, -6)).toBeGreaterThan(0.0009)
    const bounds = jscad.measurements.measureAggregateBoundingBox(
      ...geometries.map(({ geom }: Geometry) => geom),
    )
    expect(bounds[0][2]).toBe(-80)
  }
}, 30_000)
