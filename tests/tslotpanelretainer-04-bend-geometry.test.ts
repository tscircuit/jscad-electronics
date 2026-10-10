import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createTSlotPanelRetainerMesh } from "../lib/models/tslotpanelretainer"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 4: offset ledge and retaining lip locate the panel edge", () => {
  const mesh = createTSlotPanelRetainerMesh(props)
  const ledge = raySurfaceHits(mesh, [0, props.depth / 2, -1], [0, 0, 1])
  expect(ledge).toHaveLength(2)
  expect(ledge[0]).toBeCloseTo(props.offset + 1, 8)
  expect(ledge[1]).toBeCloseTo(props.offset + props.thickness + 1, 8)
  const lip = raySurfaceHits(
    mesh,
    [0, props.depth - props.thickness / 2, -1],
    [0, 0, 1],
  )
  expect(lip).toHaveLength(2)
  expect(lip[1]).toBeCloseTo(
    props.offset + props.thickness + props.panelThickness + 1,
    8,
  )
  const freeSpace = raySurfaceHits(
    mesh,
    [0, -1, props.offset + props.thickness + props.panelThickness / 2],
    [0, 1, 0],
  )
  expect(freeSpace).toHaveLength(4)
  expect(freeSpace[1]).toBeCloseTo(1 + props.thickness, 8)
  expect(freeSpace[2]).toBeCloseTo(1 + props.depth - props.thickness, 8)
})
