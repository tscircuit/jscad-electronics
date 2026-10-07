import { expect, test } from "bun:test"
import { nemaMotorMountModelPropsSchema } from "@tscircuit/modelprinter"
import { createNemaMotorMountMesh } from "../lib/models/nemamotormount"

test("nemamotormount enforces contract validation and explicitly rejects unresolved thin ligaments", () => {
  for (const props of [
    { axisHeight: 24 },
    { mountingHoleSpacing: 47.14 },
    { shaftClearanceDiameter: 22 },
    { baseHoleOffset: 2 },
  ])
    expect(() => createNemaMotorMountMesh(props)).toThrow()
  const tinyWall = { baseHoleOffset: 2.750001 }
  expect(nemaMotorMountModelPropsSchema.safeParse(tinyWall).success).toBe(true)
  expect(() => createNemaMotorMountMesh(tinyWall)).toThrow("mesh resolution")
})
