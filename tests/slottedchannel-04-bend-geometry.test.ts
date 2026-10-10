import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createSlottedChannelMesh } from "../lib/models/slottedchannel"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 4: both circular bends retain nominal wall thickness", () => {
  const r = props.innerRadius,
    R = r + props.thickness,
    mesh = createSlottedChannelMesh(props)
  for (const sign of [-1, 1]) {
    const hits = raySurfaceHits(
      mesh,
      [sign * (props.width / 2 - R), R - props.height / 2, props.length / 2],
      [sign * Math.SQRT1_2, -Math.SQRT1_2, 0],
    )
    expect(hits).toHaveLength(2)
    expect(hits[0]).toBeCloseTo(r, 8)
    expect(hits[1]).toBeCloseTo(R, 8)
  }
})
