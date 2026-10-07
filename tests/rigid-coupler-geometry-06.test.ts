import { expect, test } from "bun:test"
import {
  createRigidCouplerGeom,
  RigidCoupler,
} from "../lib/models/rigidcoupler"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { importVanilla } from "./fixtures/importVanilla"
import jscad from "@jscad/modeling"
import { example, props } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: React and built vanilla APIs share geometry; mechanical dispatch emits no PCB pads", async () => {
  const node = Footprinter3d({ footprint: example })
  expect(node?.type).toBe(RigidCoupler)
  expect(ExtrudedPads({ footprint: example })).toBeNull()
  const vanilla = await importVanilla()
  const direct = vanilla.createRigidCouplerGeom(props)
  expect(jscad.measurements.measureVolume(direct)).toBeCloseTo(
    jscad.measurements.measureVolume(createRigidCouplerGeom(props)),
    5,
  )
  expect(
    vanilla.getJscadModelForFootprintWithPads(example, jscad).geometries,
  ).toHaveLength(1)
})
