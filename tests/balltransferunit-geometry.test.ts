import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import {
  getBallTransferUnitDimensions,
  type BallTransferUnitModelPropsInput,
} from "@tscircuit/modelprinter"
import { Triangle, Vector3 } from "three"
import {
  createBallTransferUnitGeom,
  createBallTransferUnitMesh,
} from "../lib/models/balltransferunit"
import {
  assertClosedGearMesh as assertClosedMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"

for (const [name, input] of [
  ["25 mm ball", {}],
  [
    "custom inch dimensions",
    {
      ballDiameter: "0.5in",
      bodyDiameter: 17,
      height: 18,
      ballProtrusion: 4,
      flangeDiameter: 30,
      flangeThickness: 2,
      pitchCircleDiameter: 23,
      holeDiameter: 3,
    },
  ],
  ["nominal zero socket clearance", { socketClearance: 0 }],
  [
    "opening exactly on a sphere latitude",
    {
      socketClearance: 0,
      ballProtrusion: 12.5 * (1 - Math.cos(Math.PI / 6)),
    },
  ],
  [
    "opening nearly on a sphere latitude",
    {
      socketClearance: 0,
      ballProtrusion: 12.5 * (1 - Math.cos(Math.PI / 6 - 1e-11)),
    },
  ],
] satisfies [string, BallTransferUnitModelPropsInput][]) {
  test(`balltransferunit ${name}: closed cup and ball, flange, dimensions and socket`, () => {
    const d = getBallTransferUnitDimensions(input)
    const mesh = createBallTransferUnitMesh(input)
    expect(mesh.parts.map((part) => part.name)).toEqual([
      "housing",
      "load ball",
    ])
    const [housing, ball] = mesh.parts.map((part) => part.mesh)
    const housingVolume = assertClosedMesh(housing!)
    const ballVolume = assertClosedMesh(ball!)
    expect(assertClosedMesh(mesh)).toBeCloseTo(housingVolume + ballVolume, 6)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum).toEqual([-d.flangeRadius, -d.flangeRadius, 0])
    expect(bounds.maximum).toEqual([d.flangeRadius, d.flangeRadius, d.height])
    expect(meshBounds(housing!).maximum[2]).toBe(d.bodyHeight)
    expect(meshBounds(ball!).minimum[2]).toBe(d.height - d.ballDiameter)

    const cavityHeight = d.bodyHeight - d.socketBottomZ
    const cavityVolume =
      Math.PI * cavityHeight ** 2 * (d.socketRadius - cavityHeight / 3)
    const nominalHousingVolume =
      Math.PI *
        (d.bodyRadius ** 2 * d.bodyHeight +
          (d.flangeRadius ** 2 - d.bodyRadius ** 2) * d.flangeThickness -
          3 * (d.holeDiameter / 2) ** 2 * d.flangeThickness) -
      cavityVolume
    expect(Math.abs(housingVolume / nominalHousingVolume - 1)).toBeLessThan(
      0.003,
    )
    expect(
      Math.abs(ballVolume / ((4 / 3) * Math.PI * d.ballRadius ** 3) - 1),
    ).toBeLessThan(0.003)

    // The cup remains closed at the bottom and open above the rolling ball.
    const hits = raySurfaceHits(housing!, [0, 0, -1], [0, 0, 1])
    expect(hits).toHaveLength(2)
    expect(hits[0]).toBeCloseTo(1, 7)
    expect(hits[1]).toBeCloseTo(d.socketBottomZ + 1, 7)
    const center = new Vector3(0, 0, d.ballCenterZ)
    const triangle = new Triangle()
    const nearest = new Vector3()
    let clearance = Infinity
    for (let i = 0; i < housing!.indices.length; i += 3) {
      triangle.a.fromArray(housing!.positions, housing!.indices[i]! * 3)
      triangle.b.fromArray(housing!.positions, housing!.indices[i + 1]! * 3)
      triangle.c.fromArray(housing!.positions, housing!.indices[i + 2]! * 3)
      triangle.closestPointToPoint(center, nearest)
      clearance = Math.min(clearance, center.distanceTo(nearest))
    }
    expect(clearance).toBeGreaterThan(d.socketRadius * 0.998)
    if (d.socketClearance > 0) expect(clearance).toBeGreaterThan(d.ballRadius)
    const geom = createBallTransferUnitGeom(input)
    jscad.geometries.geom3.validate(geom)
    expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(
      housingVolume + ballVolume,
      6,
    )
  })
}

test("balltransferunit has three full flange holes on the prescribed pitch circle", () => {
  const d = getBallTransferUnitDimensions()
  const mesh = createBallTransferUnitMesh().parts[0]!.mesh
  const z = d.flangeBottomZ + d.flangeThickness / 2
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3
    const x = (d.pitchCircleDiameter / 2) * Math.cos(angle)
    const y = (d.pitchCircleDiameter / 2) * Math.sin(angle)
    for (const offset of [0, 0.9 * (d.holeDiameter / 2)])
      expect(raySurfaceHits(mesh, [x + offset, y, -1], [0, 0, 1])).toEqual([])
    const wall = raySurfaceHits(mesh, [x, y, z], [1, 0, 0])
    expect(wall[0]).toBeCloseTo(d.holeDiameter / 2, 6)
  }
  const solid = raySurfaceHits(mesh, [0, 20, -1], [0, 0, 1])
  expect(solid).toHaveLength(2)
  expect(solid[0]).toBeCloseTo(d.flangeBottomZ + 1, 7)
  expect(solid[1]).toBeCloseTo(d.bodyHeight + 1, 7)
})

test("balltransferunit rejects invalid geometry and unresolvable flange ligaments", () => {
  for (const input of [
    { ballDiameter: Infinity },
    { height: 10 },
    { flangeThickness: 23 },
    { pitchCircleDiameter: 34 },
    { flangeDiameter: 38 },
    { bodyDiameter: 25 },
    { holeDiameter: 0 },
    { bodyDiameter: 32 - 1e-12 },
    { flangeDiameter: 40 + 1e-12 },
    { flangeThickness: 22.5 - 1e-13 },
    { ballDiameter: 1e-10, socketClearance: 0, ballProtrusion: 2e-11 },
  ])
    expect(() => createBallTransferUnitMesh(input)).toThrow()
})
