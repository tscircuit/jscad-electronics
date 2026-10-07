import { expect, test } from "bun:test"
import { getLinearBallBearingDimensions } from "@tscircuit/modelprinter"
import { createLinearBallBearingMesh } from "../lib/models/linearballbearing"
import { sliceMesh, innerRadiusAtAngle } from "./fixtures/assert-gear-geometry"

test("linear loaded/return raceways and contact diameters are not a plain sleeve", () => {
  const d = getLinearBallBearingDimensions({}),
    mesh = createLinearBallBearingMesh({})
  const shell = mesh.parts.find(
    (part) => part.name === "grooved steel sleeve",
  )!.mesh
  const mid = sliceMesh(shell, d.length / 2)
  expect(innerRadiusAtAngle(mid, 0)).toBeCloseTo(
    d.loadedRadius + d.grooveRadius,
    8,
  )
  expect(innerRadiusAtAngle(mid, Math.PI / 6)).toBeCloseTo(
    d.returnRadius + d.grooveRadius,
    8,
  )
  expect(innerRadiusAtAngle(mid, Math.PI / 12)).toBeCloseTo(
    d.straightSleeveInnerRadius,
    8,
  )
  expect(
    innerRadiusAtAngle(sliceMesh(shell, d.sealThickness / 2), 0),
  ).toBeCloseTo(d.endChamberRadius, 8)
  const first = mesh.parts.find((part) => part.name === "loaded row 1 ball 1")!
  expect(first.center).toEqual([d.loadedRadius, 0, d.rowStart])
  expect(first.center![0] - first.radius!).toBeCloseTo(d.boreRadius, 8)
  expect(
    createLinearBallBearingMesh({}, { segments: 192 }).positions.length,
  ).toBeGreaterThan(mesh.positions.length)
})
