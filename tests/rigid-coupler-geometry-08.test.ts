import { test } from "bun:test"
import {
  getRigidCouplerDimensions,
  rigidCouplerModelPropsSchema,
} from "@tscircuit/modelprinter"
import { createRigidCouplerMesh } from "../lib/models/rigidcoupler"
import {
  assertClosedShaftMount,
  assertNoMountingEndCap,
} from "./fixtures/assert-shaft-mount-geometry"
import { props } from "./fixtures/rigid-coupler-case"

test("rigidcoupler: perpendicular thread crests leave no blind end caps against the faceted bores", () => {
  for (const input of [props, { ...props, threadPitch: 0.7257597415779593 }]) {
    const result = createRigidCouplerMesh(input)
    assertClosedShaftMount(result)
    const dimensions = getRigidCouplerDimensions(
      rigidCouplerModelPropsSchema.parse(input),
    )
    for (const hole of dimensions.screwHoles)
      assertNoMountingEndCap(result, hole)
  }
})
