import { expect, test } from "bun:test"
import {
  getNemaMotorMountHoles,
  nemaMotorDimensions,
} from "@tscircuit/modelprinter"
import { createNemaMotorMountMesh } from "../lib/models/nemamotormount"
import {
  containsMeshPoint,
  meshRayHits,
} from "./fixtures/assert-shaft-mount-geometry"
import { mountDefinition } from "./fixtures/nemamotormount-case"

test("nemamotormount clears the entire pilot projection and all six through-hole axes", () => {
  for (const size of [17, 23] as const) {
    const { fn, ...p } = mountDefinition(size)
    const mesh = createNemaMotorMountMesh(p)
    expect(meshRayHits(mesh, [0, 0, -1], [0, 0, 1])).toEqual([])
    for (let step = 0; step < 32; step++) {
      const angle = (step * Math.PI) / 16,
        radius = nemaMotorDimensions[size].pilotDiameter / 2
      expect(
        meshRayHits(
          mesh,
          [radius * Math.cos(angle), radius * Math.sin(angle), -1],
          [0, 0, 1],
        ),
      ).toEqual([])
    }
    for (const hole of getNemaMotorMountHoles(p)) {
      const { center: c, direction: d } = hole
      expect(
        meshRayHits(mesh, [c.x - d.x, c.y - d.y, c.z - d.z], [d.x, d.y, d.z]),
      ).toEqual([])
      expect(
        containsMeshPoint(mesh, [
          c.x + hole.diameter * 0.8,
          c.y + (d.y * p.thickness) / 2,
          c.z + (d.z * p.thickness) / 2,
        ]),
      ).toBe(true)
    }
    expect(meshRayHits(mesh, [p.width / 2 - 1, 0, -1], [0, 0, 1])).toEqual([
      1,
      p.thickness + 1,
    ])
    expect(
      containsMeshPoint(mesh, [
        0,
        -p.axisHeight + p.thickness / 2,
        p.thickness / 2,
      ]),
    ).toBe(true)
    expect(
      containsMeshPoint(mesh, [
        0,
        -nemaMotorDimensions[size].bodyWidth / 2,
        -p.baseDepth / 2,
      ]),
    ).toBe(false)
    expect(
      containsMeshPoint(mesh, [
        0,
        -p.axisHeight + p.thickness / 2,
        -p.baseDepth / 2,
      ]),
    ).toBe(true)
  }
})
