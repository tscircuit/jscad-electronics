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
import {
  ButtonScrew,
  createButtonScrewMesh,
  createButtonScrewGeom,
} from "../lib/ButtonScrew"
import { getButtonScrewDimensions } from "@tscircuit/modelprinter"

for (const metricSize of ["M3", "M4", "M5", "M6"] as const)
  test(`button screw ${metricSize} mesh is manifold with the exact dome and blind socket datums`, () => {
    const input = { metricSize, length: 10 }
    const d = getButtonScrewDimensions(input)
    const mesh = createButtonScrewMesh(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    const volume = assertClosedGearMesh(mesh)
    const geom = createButtonScrewGeom(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(-10)
    expect(bounds.maximum[2]).toBe(d.headHeight)
    expect(bounds.maximumRadius).toBeCloseTo(d.headDiameter / 2, 8)
    const socket = sliceMesh(mesh, d.topZ - d.socketDepth / 2)
    expect(innerRadiusAtAngle(socket, Math.PI / 2)).toBeCloseTo(
      d.socketWidth / 2,
      6,
    )
    expect(innerRadiusAtAngle(socket, 0)).toBeCloseTo(
      d.socketWidth / Math.sqrt(3),
      6,
    )
    const belowFloor = sliceMesh(mesh, d.topZ - d.socketDepth - 0.01)
    expect(innerRadiusAtAngle(belowFloor, 0)).toBeCloseTo(
      outerRadiusAtAngle(belowFloor, 0),
      6,
    )
    const centers = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i] === 0 && mesh.positions[i + 1] === 0)
        centers.push(mesh.positions[i + 2])
    expect(centers).toEqual([-10, d.topZ - d.socketDepth])
    const crownZ = d.headHeight / 2
    expect(outerRadiusAtAngle(sliceMesh(mesh, crownZ), 0)).toBeCloseTo(
      d.crownArcCenterR +
        Math.sqrt(d.crownRadius ** 2 - (crownZ - d.crownArcCenterZ) ** 2),
      6,
    )
  })

test("button screw profile has the documented thread depth, phase, runout and fillet", () => {
  const input = { metricSize: "M3" as const, length: 10 }
  const d = getButtonScrewDimensions(input)
  const mesh = createButtonScrewMesh(input)
  const z = -5.125,
    crest = (2 * Math.PI * (z + input.length)) / d.threadPitch
  const section = sliceMesh(mesh, z)
  expect(outerRadiusAtAngle(section, crest)).toBeCloseTo(d.diameter / 2, 5)
  expect(outerRadiusAtAngle(section, crest + Math.PI)).toBeCloseTo(
    d.threadMinorDiameter / 2,
    4,
  )
  const shifted = sliceMesh(mesh, z + d.threadPitch / 4)
  expect(outerRadiusAtAngle(shifted, crest + Math.PI / 2)).toBeCloseTo(
    d.diameter / 2,
    5,
  )
  const smooth = createButtonScrewMesh({ ...input, showThreads: false })
  assertClosedGearMesh(smooth)
  expect(smooth.indices.length).toBeLessThan(mesh.indices.length / 4)
  const filletZ = -d.underHeadRadius + d.underHeadRadius * Math.sin(Math.PI / 4)
  expect(outerRadiusAtAngle(sliceMesh(smooth, filletZ), 0)).toBeCloseTo(
    d.diameter / 2 +
      d.underHeadRadius -
      d.underHeadRadius * Math.cos(Math.PI / 4),
    6,
  )
  expect(outerRadiusAtAngle(sliceMesh(smooth, -0.5), 0)).toBeCloseTo(
    d.diameter / 2,
    6,
  )
})

test("buttonscrew rejects invalid tessellation options before allocation", () => {
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 10000 },
    { radialSegments: NaN },
    { segmentsPerPitch: 0 },
    { segmentsPerPitch: 1000 },
  ])
    expect(() =>
      createButtonScrewMesh({ metricSize: "M3" as const, length: 10 }, options),
    ).toThrow(/resolution limit/i)
})

test("buttonscrew React and built vanilla routing share geometry and exclude PCB pads", async () => {
  const source = "buttonscrew_standard(iso7380-1)_m3_l10mm_drive(hexsocket)"
  const definition = mp.string(source).json()
  if (definition.fn !== "buttonscrew") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const geometry = createButtonScrewGeom(props)
  const direct = getComponentModel(ButtonScrew, props)
  const routed = getComponentModel(Footprinter3d, { footprint: source })
  const vanilla = await importVanilla()
  const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(typeof vanilla.createButtonScrewMesh).toBe("function")
  expect(typeof vanilla.createButtonScrewGeom).toBe("function")
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
