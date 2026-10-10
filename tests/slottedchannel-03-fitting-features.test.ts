import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createSlottedChannelMesh } from "../lib/models/slottedchannel"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 3: web slots have clear centers, rounded ends, and end ligaments", () => {
  const mesh = createSlottedChannelMesh(props)
  for (let i = 0; i < props.slotCount; i++) {
    const z = props.endOffset + i * props.pitch
    expect(
      raySurfaceHits(mesh, [0, -props.height / 2 - 1, z], [0, 1, 0]),
    ).toEqual([])
    expect(
      raySurfaceHits(
        mesh,
        [0, -props.height / 2 - 1, z + props.slotLength / 2 - 0.2],
        [0, 1, 0],
      ),
    ).toEqual([])
    expect(
      raySurfaceHits(
        mesh,
        [0, -props.height / 2 - 1, z + props.slotLength / 2 + 0.2],
        [0, 1, 0],
      ),
    ).toHaveLength(2)
    const roundedEndCenter = z + (props.slotLength - props.slotWidth) / 2
    expect(
      raySurfaceHits(
        mesh,
        [
          props.slotWidth / 2 - 0.2,
          -props.height / 2 - 1,
          roundedEndCenter + props.slotWidth / 2 - 0.2,
        ],
        [0, 1, 0],
      ),
    ).toHaveLength(2)
  }
})
