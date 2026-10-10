import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createTSlotPanelRetainerMesh } from "../lib/models/tslotpanelretainer"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 3: fixing hole passes through the rear flange", () => {
  const mesh = createTSlotPanelRetainerMesh(props)
  const z = props.height - props.thickness - props.holeDiameter / 2
  expect(raySurfaceHits(mesh, [0, -1, z], [0, 1, 0])).toEqual([])
  expect(
    raySurfaceHits(mesh, [props.holeDiameter / 2 + 0.3, -1, z], [0, 1, 0]),
  ).toHaveLength(2)
})
