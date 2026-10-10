import { expect, test } from "bun:test"
import { createTSlotPanelRetainerMesh } from "../lib/models/tslotpanelretainer"
import { props, checkMesh } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 5: changing panel thickness updates lip height without closing the top", () => {
  checkMesh(createTSlotPanelRetainerMesh({ ...props, panelThickness: 4 }))
  checkMesh(createTSlotPanelRetainerMesh({ ...props, width: 30, depth: 20 }))
})
