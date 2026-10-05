import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { getComponentModel } from "./helpers/component-model"
import { importVanilla } from "./fixtures/importVanilla.js"
import {
  assertClosedGearMesh,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
  innerRadiusAtAngle,
  assertOpenAxialBore,
} from "./fixtures/assert-gear-geometry"
import { HexNut, createHexNutMesh, createHexNutGeom } from "../lib/HexNut"
import { getHexNutDimensions } from "@tscircuit/modelprinter"
for (const metricSize of ["M5", "M6", "M8", "M10", "M12"] as const)
  test(`hex nut ${metricSize} has a manifold through bore and double chamfers`, () => {
    const input = { metricSize }
    const d = getHexNutDimensions(input)
    const mesh = createHexNutMesh(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    const volume = assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, d.boreMinorDiameter / 2)
    const geom = createHexNutGeom(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(d.height)
    const middle = sliceMesh(mesh, d.height / 2)
    expect(outerRadiusAtAngle(middle, Math.PI / 2)).toBeCloseTo(
      d.acrossFlats / 2,
      6,
    )
    expect(outerRadiusAtAngle(middle, 0)).toBeCloseTo(d.acrossCorners / 2, 6)
    for (const angle of [
      0,
      Math.PI / 12,
      Math.PI / 6,
      Math.PI / 3 + Math.PI / 12,
    ]) {
      for (const fraction of [0.25, 0.5, 0.75]) {
        const z = d.outerChamferDepth * fraction
        const period = Math.PI / 3
        const offset =
          ((((angle - Math.PI / 2 + period / 2) % period) + period) % period) -
          period / 2
        const expected = Math.min(
          d.acrossFlats / 2 / Math.cos(offset),
          d.faceDiameter / 2 + z * Math.sqrt(3),
        )
        expect(outerRadiusAtAngle(sliceMesh(mesh, z), angle)).toBeCloseTo(
          expected,
          6,
        )
        expect(
          outerRadiusAtAngle(sliceMesh(mesh, d.height - z), angle),
        ).toBeCloseTo(expected, 6)
      }
    }
    const z = d.outerChamferDepth / 2
    expect(outerRadiusAtAngle(sliceMesh(mesh, z), 0)).toBeCloseTo(
      d.acrossFlats / 2 + z * Math.sqrt(3),
      6,
    )
    for (const at of [
      d.boreChamferDepth / 4,
      d.height - d.boreChamferDepth / 4,
    ])
      expect(innerRadiusAtAngle(sliceMesh(mesh, at), 0)).toBeCloseTo(
        d.mouthDiameter / 2 - Math.min(at, d.height - at),
        5,
      )
  })
test("hex nut internal helical crests follow the pinned 60-degree profile", () => {
  const input = { metricSize: "M6" as const }
  const d = getHexNutDimensions(input)
  const z = 2.125,
    crest = (z * 2 * Math.PI) / d.threadPitch
  const mesh = createHexNutMesh(input)
  const section = sliceMesh(mesh, z)
  expect(innerRadiusAtAngle(section, crest)).toBeCloseTo(
    d.boreMinorDiameter / 2,
    5,
  )
  expect(innerRadiusAtAngle(section, crest + Math.PI)).toBeCloseTo(
    d.diameter / 2,
    4,
  )
  expect(
    innerRadiusAtAngle(
      sliceMesh(mesh, z + d.threadPitch / 4),
      crest + Math.PI / 2,
    ),
  ).toBeCloseTo(d.boreMinorDiameter / 2, 5)
  const smooth = createHexNutMesh({ ...input, showThreads: false })
  assertClosedGearMesh(smooth)
  expect(smooth.indices.length).toBeLessThan(mesh.indices.length / 5)
  expect(innerRadiusAtAngle(sliceMesh(smooth, d.height / 2), 0)).toBeCloseTo(
    d.boreMinorDiameter / 2,
    6,
  )
})

test("hexnut rejects invalid tessellation options before allocation", () => {
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 10000 },
    { radialSegments: NaN },
    { segmentsPerPitch: 0 },
    { segmentsPerPitch: 1000 },
  ])
    expect(() =>
      createHexNutMesh({ metricSize: "M6" as const }, options),
    ).toThrow(/resolution limit/i)
})

test("hexnut React and built vanilla routing share geometry and exclude PCB pads", async () => {
  const source = "hexnut_standard(iso4032)_m6"
  const definition = mp.string(source).json()
  if (definition.fn !== "hexnut") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const geometry = createHexNutGeom(props)
  const direct = getComponentModel(HexNut, props)
  const routed = getComponentModel(Footprinter3d, { footprint: source })
  const vanilla = await importVanilla()
  const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(typeof vanilla.createHexNutMesh).toBe("function")
  expect(typeof vanilla.createHexNutGeom).toBe("function")
  for (const result of [direct, routed, built]) {
    expect(result.geometries).toHaveLength(1)
    const solid = result.geometries[0]!.geom as jscad.geometries.geom3.Geom3
    expect(jscad.measurements.measureBoundingBox(solid)).toEqual(
      jscad.measurements.measureBoundingBox(geometry),
    )
    expect(jscad.measurements.measureVolume(solid)).toBeCloseTo(
      jscad.measurements.measureVolume(geometry),
      6,
    )
  }
})
