import { expect, test } from "bun:test"
import { createTSlotPanelRetainerMesh } from "../lib/models/tslotpanelretainer"
import { props, checkMesh } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 2: indexed triangles form a closed outward manifold", () => {
  checkMesh(createTSlotPanelRetainerMesh(props))
})
