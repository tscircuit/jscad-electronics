import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { mp } from "@tscircuit/modelprinter"
import {
  JawCoupling,
  createJawCouplingGeom,
  createJawCouplingMesh,
  createJawCouplingParts,
} from "../lib/models/jawcoupling"
import {
  BeamCoupling,
  createBeamCouplingGeom,
  createBeamCouplingMesh,
} from "../lib/models/beamcoupling"
import {
  OldhamCoupling,
  createOldhamCouplingGeom,
  createOldhamCouplingMesh,
  createOldhamCouplingParts,
} from "../lib/models/oldhamcoupling"
import {
  UniversalJoint,
  createUniversalJointGeom,
  createUniversalJointMesh,
  createUniversalJointParts,
} from "../lib/models/universaljoint"
import {
  BevelGear,
  createBevelGearGeom,
  createBevelGearMesh,
} from "../lib/models/bevelgear"
import { getComponentModel } from "./helpers/component-model"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { importVanilla } from "./fixtures/importVanilla.js"
const { measurements, primitives, booleans } = jscad
const cases = [
  {
    name: "jawcoupling",
    Component: JawCoupling,
    geom: createJawCouplingGeom,
    mesh: createJawCouplingMesh,
    size: [30, 30, 40],
  },
  {
    name: "beamcoupling",
    Component: BeamCoupling,
    geom: createBeamCouplingGeom,
    mesh: createBeamCouplingMesh,
    size: [25, 25, 30],
  },
  {
    name: "oldhamcoupling",
    Component: OldhamCoupling,
    geom: createOldhamCouplingGeom,
    mesh: createOldhamCouplingMesh,
    size: [30, 30, 36],
  },
  {
    name: "universaljoint",
    Component: UniversalJoint,
    geom: createUniversalJointGeom,
    mesh: createUniversalJointMesh,
    size: [30, 30, 60],
  },
  {
    name: "bevelgear",
    Component: BevelGear,
    geom: createBevelGearGeom,
    mesh: createBevelGearMesh,
    size: [40, 40, 22],
  },
] as const
function probe(
  geom: jscad.geometries.geom3.Geom3,
  center: [number, number, number],
) {
  return measurements.measureVolume(
    booleans.intersect(
      geom,
      primitives.cuboid({ size: [0.1, 0.1, 0.1], center }),
    ),
  )
}
for (const entry of cases) {
  test(`${entry.name} is a finite indexed solid with the declared envelope and real shaft bores`, () => {
    const geom = entry.geom({}),
      mesh = entry.mesh({})
    expect(measurements.measureVolume(geom)).toBeGreaterThan(0)
    const [min, max] = measurements.measureBoundingBox(geom)
    entry.size.forEach((dimension, i) =>
      expect(max[i]! - min[i]!).toBeCloseTo(dimension, 3),
    )
    expect(min[2]).toBeCloseTo(0, 6)
    expect(mesh.positions.length).toBeGreaterThan(0)
    expect(mesh.positions.every(Number.isFinite)).toBe(true)
    expect(mesh.indices.length % 3).toBe(0)
    expect(mesh.indices.length).toBeGreaterThan(0)
    expect(
      mesh.indices.every(
        (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
      ),
    ).toBe(true)
    expect(probe(geom, [0, 0, 2])).toBeCloseTo(0, 8)
    expect(() => entry.geom({ outerDiameter: 0 })).toThrow()
  })
  test(`${entry.name} explicit React and model-string routing preserve volume and produce no copper pads`, () => {
    const definition = mp.string(entry.name).json()
    expect(definition.fn).toBe(entry.name)
    const volume = measurements.measureVolume(entry.geom({}))
    for (const model of [
      getComponentModel(entry.Component, {}),
      getComponentModel(Footprinter3d, { footprint: entry.name }),
    ]) {
      const renderedVolume = model.geometries.reduce(
        (sum, { geom }) =>
          sum +
          measurements.measureVolume(geom as jscad.geometries.geom3.Geom3),
        0,
      )
      expect(renderedVolume).toBeCloseTo(volume, 3)
    }
    expect(ExtrudedPads({ footprint: entry.name })).toBeNull()
    expect(() =>
      Footprinter3d({ footprint: entry.name + "_typo1mm" }),
    ).toThrow()
  })
}
test("jawcoupling has interleaved drive jaws and a separate lobed spider", () => {
  const { hubs, spider } = createJawCouplingParts({})
  expect(probe(hubs, [13, 0, 20])).toBeGreaterThan(0)
  expect(
    probe(hubs, [13 * Math.cos(Math.PI / 3), 13 * Math.sin(Math.PI / 3), 20]),
  ).toBeGreaterThan(0)
  expect(
    probe(hubs, [13 * Math.cos(Math.PI / 6), 13 * Math.sin(Math.PI / 6), 20]),
  ).toBeCloseTo(0, 8)
  expect(
    probe(spider, [12 * Math.cos(Math.PI / 6), 12 * Math.sin(Math.PI / 6), 20]),
  ).toBeGreaterThan(0)
  expect(probe(spider, [13, 0, 20])).toBeCloseTo(0, 8)
  expect(createJawCouplingMesh({ jawCount: 4 }).indices).not.toEqual(
    createJawCouplingMesh({}).indices,
  )
})
test("beamcoupling slots cut the wall while successive bridges rotate by 90 degrees", () => {
  const geom = createBeamCouplingGeom({})
  const first = 7 + 16 / 7,
    second = 7 + 32 / 7
  expect(probe(geom, [10, 0, first])).toBeGreaterThan(0)
  expect(probe(geom, [0, 10, first])).toBeCloseTo(0, 8)
  expect(probe(geom, [0, 10, second])).toBeGreaterThan(0)
  expect(probe(geom, [10, 0, second])).toBeCloseTo(0, 8)
  expect(
    measurements.measureVolume(createBeamCouplingGeom({ slotWidth: 0.5 })),
  ).toBeGreaterThan(measurements.measureVolume(geom))
})
test("oldhamcoupling has orthogonal open face slots and matching center-disk tongues", () => {
  const { hubs, disk } = createOldhamCouplingParts({})
  expect(probe(hubs, [10, 0, 11])).toBeCloseTo(0, 8)
  expect(probe(hubs, [0, 10, 11])).toBeGreaterThan(0)
  expect(probe(hubs, [0, 10, 25])).toBeCloseTo(0, 8)
  expect(probe(hubs, [10, 0, 25])).toBeGreaterThan(0)
  expect(probe(disk, [10, 0, 11])).toBeGreaterThan(0)
  expect(probe(disk, [0, 10, 25])).toBeGreaterThan(0)
  expect(probe(disk, [0, 10, 11])).toBeCloseTo(0, 8)
  expect(
    measurements.measureVolume(booleans.intersect(hubs, disk)),
  ).toBeCloseTo(0, 6)
})
test("universaljoint has orthogonal forks with journal bores and a separate center cross", () => {
  const { forks, cross } = createUniversalJointParts({})
  expect(probe(forks, [12.5, 0, 20])).toBeGreaterThan(0)
  expect(probe(forks, [0, 12.5, 40])).toBeGreaterThan(0)
  expect(probe(forks, [12.5, 0, 30])).toBeCloseTo(0, 8)
  expect(probe(forks, [0, 12.5, 30])).toBeCloseTo(0, 8)
  expect(probe(cross, [12.5, 0, 30])).toBeGreaterThan(0)
  expect(probe(cross, [0, 12.5, 30])).toBeGreaterThan(0)
  expect(probe(cross, [0, 0, 30])).toBeGreaterThan(0)
  expect(
    measurements.measureVolume(booleans.intersect(forks, cross)),
  ).toBeCloseTo(0, 6)
})
test("bevelgear teeth taper toward the hub and leave open root gaps", () => {
  const geom = createBevelGearGeom({})
  expect(probe(geom, [19.1, 0, 1])).toBeGreaterThan(0)
  expect(
    probe(geom, [
      19.1 * Math.cos(Math.PI / 16),
      19.1 * Math.sin(Math.PI / 16),
      1,
    ]),
  ).toBeCloseTo(0, 8)
  expect(probe(geom, [18, 0, 13])).toBeCloseTo(0, 8)
  expect(probe(geom, [11.8, 0, 13])).toBeGreaterThan(0)
  expect(probe(geom, [8, 0, 19])).toBeGreaterThan(0)
  expect(createBevelGearMesh({ teeth: 12 }).indices).not.toEqual(
    createBevelGearMesh({}).indices,
  )
})

for (const entry of cases) {
  test(`${entry.name} exports its built vanilla mesh factory and routes the complete model string`, async () => {
    const vanilla = await importVanilla()
    const strings = {
      jawcoupling:
        "jawcoupling_od30mm_l40mm_bore8mm_hubl12mm_jawd12mm_jawcount3",
      beamcoupling:
        "beamcoupling_od25mm_l30mm_bore8mm_hubl7mm_slotw1mm_slots6_bridgeangle60",
      oldhamcoupling:
        "oldhamcoupling_od30mm_l36mm_bore8mm_hubl12mm_slotw7mm_slotd3mm_clearance0.2mm",
      universaljoint:
        "universaljoint_od30mm_l60mm_bore8mm_hubl14mm_armt5mm_crossd6mm_clearance0.2mm",
      bevelgear:
        "bevelgear_od40mm_td24mm_h14mm_bore8mm_depth3mm_hubd20mm_hubh8mm_teeth16",
    }
    expect(vanilla[entry.mesh.name]({})).toEqual(entry.mesh({}))
    const rendered = vanilla.getJscadModelForFootprintWithPads(
      strings[entry.name],
      jscad,
    )
    const volume = rendered.geometries.reduce(
      (sum: number, { geom }: { geom: jscad.geometries.geom3.Geom3 }) =>
        sum + measurements.measureVolume(geom),
      0,
    )
    expect(volume).toBeCloseTo(measurements.measureVolume(entry.geom({})), 3)
  })
}

test("bevelgear convex tooth caps produce closed edge-conforming default and custom meshes", () => {
  for (const props of [
    {},
    { teeth: 6 },
    { teeth: 24 },
    {
      outerDiameter: 60,
      topDiameter: 30,
      height: 12,
      toothDepth: 4,
      teeth: 23,
    },
  ]) {
    const mesh = createBevelGearMesh(props)
    const edges = new Map<string, { count: number; direction: number }>()
    for (let i = 0; i < mesh.indices.length; i += 3)
      for (let k = 0; k < 3; k++) {
        const a = mesh.indices[i + k]!,
          b = mesh.indices[i + ((k + 1) % 3)]!
        const key = [Math.min(a, b), Math.max(a, b)].join(",")
        const edge = edges.get(key) ?? { count: 0, direction: 0 }
        edge.count++
        edge.direction += a < b ? 1 : -1
        edges.set(key, edge)
      }
    expect(
      [...edges.values()].every(
        ({ count, direction }) => count === 2 && direction === 0,
      ),
    ).toBe(true)
  }
})
