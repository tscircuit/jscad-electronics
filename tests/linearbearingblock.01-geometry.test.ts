import { expect, test } from "bun:test"
import jscad from "@jscad/modeling"
import { getLinearBearingBlockDimensions } from "@tscircuit/modelprinter"
import {
  createLinearBearingBlockMesh,
  createLinearBearingBlockGeom,
} from "../lib/models/linearbearingblock"
import { assertAssembly, rayHits } from "./fixtures/linearbearingblock-geometry"
import {
  assertClosedGearMesh,
  meshBounds,
} from "./fixtures/assert-gear-geometry"

test("block housing, independent recirculating cartridge and four mounting holes form a clear closed assembly", () => {
  const d = getLinearBearingBlockDimensions({}),
    mesh = createLinearBearingBlockMesh({})
  const volume = assertAssembly(mesh.parts)
  const bounds = meshBounds(mesh)
  expect(bounds.minimum).toEqual([-17, -12, 0])
  expect(bounds.maximum).toEqual([17, 12, 24])
  const housing = mesh.parts.find((part) => part.name === "housing")!.mesh
  const polygonFactor = (96 / 2) * Math.sin((2 * Math.PI) / 96)
  const idealHousingVolume =
    d.width * d.length * d.height -
    Math.PI * d.cartridgeRadius ** 2 * d.length -
    4 * polygonFactor * (d.mountHoleDiameter / 2) ** 2 * d.height
  const volumeOfHousing = assertClosedGearMesh(housing)
  const uniformCircleChordError =
    Math.PI *
    d.cartridgeRadius ** 2 *
    d.length *
    (1 - Math.sin((2 * Math.PI) / 96) / ((2 * Math.PI) / 96))
  expect(volumeOfHousing).toBeGreaterThanOrEqual(idealHousingVolume)
  expect(volumeOfHousing).toBeLessThanOrEqual(
    idealHousingVolume + uniformCircleChordError,
  )
  // Exact shared vertices prove the housing and cartridge use the same chords.
  const sleeve = mesh.parts.find(
    (part) => part.name === "grooved steel sleeve",
  )!.mesh
  const endRing: [number, number][] = []
  for (let i = 0; i < sleeve.positions.length; i += 3) {
    if (sleeve.positions[i + 1] !== -d.length / 2) break
    endRing.push([sleeve.positions[i]!, sleeve.positions[i + 2]!])
  }
  expect(endRing.length).toBeGreaterThan(96)
  for (const [x, z] of endRing) {
    expect(
      housing.positions.some(
        (value, i) =>
          i % 3 === 0 &&
          value === x &&
          housing.positions[i + 1] === -d.length / 2 &&
          housing.positions[i + 2] === z,
      ),
    ).toBe(true)
  }
  for (const [x, y] of d.mountingCenters)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4,
        r = (0.95 * d.mountHoleDiameter) / 2
      expect(
        rayHits(
          mesh,
          [x + r * Math.cos(angle), y + r * Math.sin(angle), -1],
          [0, 0, 1],
        ),
      ).toBe(false)
    }
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI) / 12,
      r = 0.98 * d.boreRadius
    expect(
      rayHits(
        mesh,
        [
          r * Math.cos(angle),
          -d.length / 2 - 1,
          d.shaftHeight + r * Math.sin(angle),
        ],
        [0, 1, 0],
      ),
    ).toBe(false)
  }
  const geom = createLinearBearingBlockGeom({})
  jscad.geometries.geom3.validate(geom)
  expect(jscad.measurements.measureVolume(geom)).toBeCloseTo(volume, 6)
})
