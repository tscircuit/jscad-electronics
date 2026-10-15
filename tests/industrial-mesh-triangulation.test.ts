import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { geom3ToIndexedMesh } from "../lib/mechanical/geom3-to-indexed-mesh"
import { createRigidPipeGeom } from "../lib/models/rigidpipe/geometry"
import { createPipeFlangeGeom } from "../lib/models/pipeflange/geometry"
import { createPipeTeeGeom } from "../lib/models/pipetee/geometry"
import { createShaftSupportGeom } from "../lib/models/shaftsupport/geometry"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
} from "./fixtures/assert-gear-geometry"

const { cuboid, cylinder } = jscad.primitives
const { subtract, union } = jscad.booleans
const { translate } = jscad.transforms

function assertClosedSolid(geom: jscad.geometries.geom3.Geom3) {
  const before = jscad.measurements.measureVolume(geom)
  expect(before).toBeGreaterThan(0)
  const mesh = geom3ToIndexedMesh(geom)
  // Every undirected edge must have exactly two oppositely wound triangles,
  // including subdivisions where a boolean face meets an existing vertex.
  const after = assertClosedGearMesh(mesh)
  expect(after / before).toBeCloseTo(1, 3)
  return mesh
}

test("a hollow rigid pipe exports a watertight annular mesh without capping its bore", () => {
  const mesh = assertClosedSolid(createRigidPipeGeom())
  const axial = {
    ...mesh,
    positions: mesh.positions.flatMap((_, i) =>
      i % 3 === 0
        ? [mesh.positions[i + 1]!, mesh.positions[i + 2]!, mesh.positions[i]!]
        : [],
    ),
  }
  assertOpenAxialBore(axial, 5)
})

test("a bolted pipe flange preserves all boundaries at its hub and drilled holes", () => {
  const mesh = assertClosedSolid(createPipeFlangeGeom())
  expect(mesh.indices.length).toBeGreaterThan(1000)
})

test("three connected hollow fitting ports export a closed solid boundary", () => {
  assertClosedSolid(createPipeTeeGeom())
})

test("a stepped mounting plate with four through holes remains edge conforming", () => {
  const plate = cuboid({ size: [40, 25, 4], center: [0, 0, 2] })
  const boss = cuboid({ size: [10, 12, 4], center: [0, 0, 6] })
  const holes = [-12, 12].flatMap((x) =>
    [-6, 6].map((y) =>
      cylinder({ radius: 2, height: 6, center: [x, y, 2], segments: 32 }),
    ),
  )
  const geom = subtract(union(plate, boss), ...holes)
  const mesh = assertClosedSolid(geom)
  expect(mesh.positions.length).toBeGreaterThan(100)
})

test("triangulation preserves disconnected positive solids and handles empty inputs explicitly", () => {
  assertClosedSolid(
    union(
      cuboid({ size: [2, 3, 4] }),
      translate([8, 0, 0], cuboid({ size: [2, 3, 4] })),
    ),
  )
  expect(() => geom3ToIndexedMesh(jscad.geometries.geom3.create())).toThrow(
    "nonempty",
  )
})

test("nearly identical boolean vertices cannot create a snap-cell crack in a split shaft support", () => {
  assertClosedSolid(createShaftSupportGeom())
})
