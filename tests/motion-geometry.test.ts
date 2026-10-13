import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  getPillowBlockBearingDimensions,
  getFlangeBearingDimensions,
  getNeedleBearingDimensions,
  getCylindricalRollerBearingDimensions,
  getCamFollowerDimensions,
  getVGrooveWheelDimensions,
  getRodEndDimensions,
  getSphericalBearingDimensions,
  getClevisDimensions,
  getGearRackDimensions,
  getSprocketDimensions,
  getRollerChainDimensions,
  getVBeltSheaveDimensions,
  getConveyorRollerDimensions,
  getShaftSupportDimensions,
} from "@tscircuit/modelprinter"
import {
  createPillowBlockBearingGeom,
  createPillowBlockBearingMesh,
} from "../lib/models/pillowblockbearing/geometry"
import {
  createFlangeBearingGeom,
  createFlangeBearingMesh,
} from "../lib/models/flangebearing/geometry"
import {
  createNeedleBearingGeom,
  createNeedleBearingMesh,
} from "../lib/models/needlebearing/geometry"
import {
  createCylindricalRollerBearingGeom,
  createCylindricalRollerBearingMesh,
} from "../lib/models/cylindricalrollerbearing/geometry"
import {
  createCamFollowerGeom,
  createCamFollowerMesh,
} from "../lib/models/camfollower/geometry"
import {
  createVGrooveWheelGeom,
  createVGrooveWheelMesh,
} from "../lib/models/vgroovewheel/geometry"
import {
  createRodEndGeom,
  createRodEndMesh,
} from "../lib/models/rodend/geometry"
import {
  createSphericalBearingGeom,
  createSphericalBearingMesh,
} from "../lib/models/sphericalbearing/geometry"
import {
  createClevisGeom,
  createClevisMesh,
} from "../lib/models/clevis/geometry"
import {
  createGearRackGeom,
  createGearRackMesh,
} from "../lib/models/gearrack/geometry"
import {
  createSprocketGeom,
  createSprocketMesh,
} from "../lib/models/sprocket/geometry"
import {
  createRollerChainGeom,
  createRollerChainMesh,
} from "../lib/models/rollerchain/geometry"
import {
  createVBeltSheaveGeom,
  createVBeltSheaveMesh,
} from "../lib/models/vbeltsheave/geometry"
import {
  createConveyorRollerGeom,
  createConveyorRollerMesh,
} from "../lib/models/conveyorroller/geometry"
import {
  createShaftSupportGeom,
  createShaftSupportMesh,
} from "../lib/models/shaftsupport/geometry"
function expectClosedMesh(mesh: { positions: number[]; indices: number[] }) {
  const edges = new Map<string, { count: number; balance: number }>()
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const triangle = mesh.indices.slice(i, i + 3)
    if (new Set(triangle).size !== 3)
      throw new Error("Degenerate indexed triangle")
    for (let side = 0; side < 3; side++) {
      const a = triangle[side]!,
        b = triangle[(side + 1) % 3]!
      const key = `${Math.min(a, b)},${Math.max(a, b)}`
      const edge = edges.get(key) ?? { count: 0, balance: 0 }
      edge.count++
      edge.balance += a < b ? 1 : -1
      edges.set(key, edge)
    }
  }
  expect(
    [...edges.values()].every((edge) => edge.count === 2 && edge.balance === 0),
  ).toBe(true)
}

function occupied(
  geom: jscad.geometries.geom3.Geom3,
  point: [number, number, number],
  radius = 0.03,
) {
  const probe = jscad.primitives.sphere({ radius, segments: 8, center: point })
  return (
    jscad.measurements.measureVolume(jscad.booleans.intersect(geom, probe)) >
    1e-10
  )
}

test("pillowblockbearing: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createPillowBlockBearingGeom()
  const mesh = createPillowBlockBearingMesh()
  expectClosedMesh(mesh)
  const dimensions = getPillowBlockBearingDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 30])).toBe(false)
  expect(occupied(geom, [30, 0, 4])).toBe(false)
  expect(occupied(geom, [0, 0, 4])).toBe(true)
})

test("flangebearing: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createFlangeBearingGeom()
  const mesh = createFlangeBearingMesh()
  expectClosedMesh(mesh)
  const dimensions = getFlangeBearingDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 13])).toBe(false)
  expect(occupied(geom, [23, 23, 3])).toBe(false)
  expect(occupied(geom, [29, 0, 3])).toBe(true)
  expect(occupied(geom, [0, 20, 14])).toBe(true)
})

test("needlebearing: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createNeedleBearingGeom()
  const mesh = createNeedleBearingMesh()
  expectClosedMesh(mesh)
  const dimensions = getNeedleBearingDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 10])).toBe(false)
  expect(occupied(geom, [12.5, 0, 10])).toBe(true)
  expect(occupied(geom, [12.3100969126526, 2.170602220836629, 10])).toBe(false)
})

test("cylindricalrollerbearing: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createCylindricalRollerBearingGeom()
  const mesh = createCylindricalRollerBearingMesh()
  expectClosedMesh(mesh)
  const dimensions = getCylindricalRollerBearingDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 8])).toBe(false)
  expect(occupied(geom, [15.5, 0, 8])).toBe(true)
  expect(occupied(geom, [14.971850307480558, 4.011695199089072, 8])).toBe(false)
})

test("camfollower: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createCamFollowerGeom()
  const mesh = createCamFollowerMesh()
  expectClosedMesh(mesh)
  const dimensions = getCamFollowerDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 39])).toBe(false)
  expect(occupied(geom, [0, 0, 10])).toBe(true)
  expect(occupied(geom, [10.185, 0, 33])).toBe(true)
})

test("vgroovewheel: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createVGrooveWheelGeom()
  const mesh = createVGrooveWheelMesh()
  expectClosedMesh(mesh)
  const dimensions = getVGrooveWheelDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 6])).toBe(false)
  expect(occupied(geom, [19, 0, 6])).toBe(false)
  expect(occupied(geom, [13, 0, 6])).toBe(true)
  expect(occupied(geom, [19, 0, 1])).toBe(true)
})

test("rodend: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createRodEndGeom()
  const mesh = createRodEndMesh()
  expectClosedMesh(mesh)
  const dimensions = getRodEndDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 6])).toBe(false)
  expect(occupied(geom, [0, -29, 6])).toBe(true)
  expect(occupied(geom, [9, 0, 6])).toBe(true)
  expect(occupied(geom, [0, 12, 6])).toBe(true)
})

test("sphericalbearing: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createSphericalBearingGeom()
  const mesh = createSphericalBearingMesh()
  expectClosedMesh(mesh)
  const dimensions = getSphericalBearingDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 7], 0.005)).toBe(false)
  expect(occupied(geom, [10, 0, 7], 0.005)).toBe(true)
  expect(occupied(geom, [14, 0, 7], 0.005)).toBe(true)
  expect(occupied(geom, [11.025, 0, 7], 0.005)).toBe(false)
  expect(occupied(geom, [7, 0, 13])).toBe(true)
  expect(occupied(geom, [14, 0, 13])).toBe(false)
})

test("clevis: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createClevisGeom()
  const mesh = createClevisMesh()
  expectClosedMesh(mesh)
  const dimensions = getClevisDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 30, 10])).toBe(false)
  expect(occupied(geom, [10, 25, 10])).toBe(true)
  expect(occupied(geom, [10, 37, 10])).toBe(false)
  expect(occupied(geom, [0, 5, 10])).toBe(false)
})

test("gearrack: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createGearRackGeom()
  const mesh = createGearRackMesh()
  expectClosedMesh(mesh)
  const dimensions = getGearRackDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [-36, 3, 10])).toBe(true)
  expect(occupied(geom, [-40, 0, 10])).toBe(false)
  expect(occupied(geom, [-40, 0, 4])).toBe(true)
  expect(occupied(geom, [-44, 0, 4])).toBe(false)
})

test("sprocket: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createSprocketGeom()
  const mesh = createSprocketMesh()
  expectClosedMesh(mesh)
  const dimensions = getSprocketDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 4])).toBe(false)
  expect(occupied(geom, [29, 0, 4])).toBe(true)
  expect(occupied(geom, [27.461987851290452, 5.462529016451591, 4])).toBe(false)
  expect(occupied(geom, [11, 0, 13])).toBe(true)
})

test("rollerchain: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createRollerChainGeom()
  const mesh = createRollerChainMesh()
  expectClosedMesh(mesh)
  const dimensions = getRollerChainDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [19.05, 4, 0.6])).toBe(true)
  expect(occupied(geom, [12.7, 3, 4])).toBe(true)
  expect(occupied(geom, [6.35, 0, 4])).toBe(false)
  expect(occupied(geom, [0, 0, -0.6])).toBe(true)
})

test("vbeltsheave: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createVBeltSheaveGeom()
  const mesh = createVBeltSheaveMesh()
  expectClosedMesh(mesh)
  const dimensions = getVBeltSheaveDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 10])).toBe(false)
  expect(occupied(geom, [28, 0, 6])).toBe(false)
  expect(occupied(geom, [28, 0, 12])).toBe(true)
  expect(occupied(geom, [11, 0, 28])).toBe(true)
})

test("conveyorroller: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createConveyorRollerGeom()
  const mesh = createConveyorRollerMesh()
  expectClosedMesh(mesh)
  const dimensions = getConveyorRollerDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [15, 0, 75])).toBe(false)
  expect(occupied(geom, [24, 0, 75])).toBe(true)
  expect(occupied(geom, [0, 0, -5])).toBe(true)
  expect(occupied(geom, [15, 0, 2])).toBe(true)
})

test("shaftsupport: recognizable features, finite indexed mesh and positive solid volume", () => {
  const geom = createShaftSupportGeom()
  const mesh = createShaftSupportMesh()
  expectClosedMesh(mesh)
  const dimensions = getShaftSupportDimensions()
  const [min, max] = jscad.measurements.measureBoundingBox(geom)
  for (let axis = 0; axis < 3; axis++)
    expect(max[axis]! - min[axis]!).toBeCloseTo(dimensions.size[axis]!, 3)
  expect(min[2]).toBeCloseTo(dimensions.bottomZ, 3)
  expect(max[2]).toBeCloseTo(dimensions.topZ, 3)
  const volume = jscad.measurements.measureVolume(geom)
  expect(Number.isFinite(volume) && volume > 0).toBe(true)
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.indices.length).toBeGreaterThan(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(
    mesh.indices.every(
      (i) => Number.isInteger(i) && i >= 0 && i < mesh.positions.length / 3,
    ),
  ).toBe(true)
  expect(occupied(geom, [0, 0, 26])).toBe(false)
  expect(occupied(geom, [0, 0, 38])).toBe(false)
  expect(occupied(geom, [5, 5, 38])).toBe(true)
  expect(occupied(geom, [20, 0, 3])).toBe(false)
  expect(occupied(geom, [7, 0, 37.5])).toBe(false)
})

test("motion variants retain closed oriented mesh boundaries", () => {
  for (const mesh of [
    createNeedleBearingMesh({
      innerDiameter: 25,
      outerDiameter: 36,
      raceThickness: 2,
      width: 30,
      rollerCount: 24,
    }),
    createSphericalBearingMesh({
      outerDiameter: 34,
      boreDiameter: 10,
      width: 12,
      ballDiameter: 24,
    }),
    createRollerChainMesh({
      pitch: 15,
      linkCount: 3,
      rollerDiameter: 10,
      width: 10,
      pinDiameter: 5,
      plateThickness: 1.4,
    }),
    createGearRackMesh({
      pitch: 6,
      toothCount: 7,
      width: 10,
      baseHeight: 6,
      toothHeight: 3,
      mountHoleDiameter: 3,
    }),
    createShaftSupportMesh({
      boreDiameter: 18,
      baseWidth: 60,
      baseDepth: 34,
      baseThickness: 8,
      headWidth: 28,
      headDepth: 22,
      headHeight: 37,
      centerHeight: 29,
      mountSpacing: 44,
      mountHoleDiameter: 6,
      slitWidth: 2,
      clampHoleDiameter: 4,
    }),
  ])
    expectClosedMesh(mesh)
})
