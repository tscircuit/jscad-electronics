import { expect, test } from "bun:test"
import { createZeeBarMesh } from "../lib/models/zeebar"
import { props, checkMesh } from "./fixtures/zeebar"
test("zeebar 5: unequal flanges and zero inside radius remain closed", () => {
  checkMesh(createZeeBarMesh({ ...props, upperWidth: 30, lowerWidth: 15 }))
  checkMesh(createZeeBarMesh({ ...props, bendRadius: 0 }))
})
