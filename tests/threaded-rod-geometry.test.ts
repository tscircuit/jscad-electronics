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
  ThreadedRod,
  createThreadedRodMesh,
  createThreadedRodGeom,
} from "../lib/ThreadedRod"
import { getThreadedRodDimensions } from "@tscircuit/modelprinter"
for (const metricSize of ["M2.5", "M6", "M20"] as const)
  test(`threaded rod ${metricSize} keeps both end datums and 45-degree chamfers`, () => {
    const input = { metricSize, length: 10, chamfer: 0.3 }
    const d = getThreadedRodDimensions(input)
    const mesh = createThreadedRodMesh(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    const volume = assertClosedGearMesh(mesh)
    const geom = createThreadedRodGeom(input, {
      radialSegments: 48,
      segmentsPerPitch: 16,
    })
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(0)
    expect(bounds.maximum[2]).toBe(10)
    expect(bounds.maximumRadius).toBeCloseTo(d.diameter / 2, 6)
    const endRadii = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === 0 || mesh.positions[i + 2] === 10)
        endRadii.push(Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!))
    expect(Math.max(...endRadii)).toBeLessThanOrEqual(d.endDiameter / 2 + 1e-10)
  })
for (const threadHand of ["right", "left"] as const)
  test(`threaded rod ${threadHand} winding advances by one lead without end runout`, () => {
    const input = {
      metricSize: "M6" as const,
      length: 10,
      threadPitch: 0.75,
      threadHand,
      chamfer: 0,
    }
    const d = getThreadedRodDimensions(input)
    const mesh = createThreadedRodMesh(input)
    assertClosedGearMesh(mesh)
    const z = 3.75 + 0.75 / 4,
      sign = threadHand === "right" ? 1 : -1,
      crest = ((sign * z) / d.threadPitch) * 2 * Math.PI
    const section = sliceMesh(mesh, z)
    expect(outerRadiusAtAngle(section, crest)).toBeCloseTo(d.diameter / 2, 5)
    expect(outerRadiusAtAngle(section, crest + Math.PI)).toBeCloseTo(
      d.minorDiameter / 2,
      4,
    )
    expect(
      outerRadiusAtAngle(
        sliceMesh(mesh, z + d.threadPitch / 4),
        crest + (sign * Math.PI) / 2,
      ),
    ).toBeCloseTo(d.diameter / 2, 5)
    expect(
      outerRadiusAtAngle(
        sliceMesh(mesh, z + d.threadPitch / 4),
        crest - (sign * Math.PI) / 2,
      ),
    ).toBeCloseTo(d.minorDiameter / 2, 4)
    const end = []
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (mesh.positions[i + 2] === 0 && mesh.positions[i] !== 0)
        end.push(Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!))
    expect(Math.min(...end)).toBeCloseTo(d.minorDiameter / 2, 6)
  })
test("threaded rod allocation guards reject excessive turns and vanishing radii", () => {
  expect(() =>
    createThreadedRodMesh({ metricSize: "M6", length: 1e12 }),
  ).toThrow(/resolution limit/i)
  expect(() =>
    createThreadedRodMesh({
      metricSize: "M6",
      length: 10,
      threadPitch: 1e-100,
    }),
  ).toThrow(/resolution limit/i)
  expect(() =>
    createThreadedRodMesh({ metricSize: "M6", length: 10, chamfer: 3 - 1e-12 }),
  ).toThrow(/resolution limit/i)
})

test("threadedrod rejects invalid tessellation options before allocation", () => {
  for (const options of [
    { radialSegments: 25 },
    { radialSegments: 10000 },
    { radialSegments: NaN },
    { segmentsPerPitch: 0 },
    { segmentsPerPitch: 1000 },
  ])
    expect(() =>
      createThreadedRodMesh({ metricSize: "M6" as const, length: 10 }, options),
    ).toThrow(/resolution limit/i)
})

test("threadedrod React and built vanilla routing share geometry and exclude PCB pads", async () => {
  const source =
    "threadedrod_spec(custom)_m6_l100mm_thread(full)_ends(flat)_chamfer0.5mm"
  const definition = mp.string(source).json()
  if (definition.fn !== "threadedrod") throw new Error("Unexpected model")
  const { fn, ...props } = definition
  const geometry = createThreadedRodGeom(props)
  const direct = getComponentModel(ThreadedRod, props)
  const routed = getComponentModel(Footprinter3d, { footprint: source })
  const vanilla = await importVanilla()
  const built = vanilla.getJscadModelForFootprintWithPads(source, jscad)
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(typeof vanilla.createThreadedRodMesh).toBe("function")
  expect(typeof vanilla.createThreadedRodGeom).toBe("function")
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
