import { expect, test } from "bun:test"
import { raySurfaceHits } from "./fixtures/tslot-geometry-probes"
import { createPerforatedAngleMesh } from "../lib/models/perforatedangle"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 3: both leg rows are through holes with intact edge ligaments", () => {
  const mesh = createPerforatedAngleMesh(props)
  for (let i = 0; i < props.holeCount; i++) {
    const z = props.endOffset + i * props.pitch
    expect(
      raySurfaceHits(
        mesh,
        [props.legOffset - props.width / 2, -props.height / 2 - 1, z],
        [0, 1, 0],
      ),
    ).toEqual([])
    expect(
      raySurfaceHits(
        mesh,
        [-props.width / 2 - 1, props.legOffset - props.height / 2, z],
        [1, 0, 0],
      ),
    ).toEqual([])
    expect(
      raySurfaceHits(
        mesh,
        [
          props.legOffset - props.width / 2,
          -props.height / 2 - 1,
          z + props.holeDiameter / 2 + 0.3,
        ],
        [0, 1, 0],
      ),
    ).toHaveLength(2)
  }
})
