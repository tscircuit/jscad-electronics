import { expect, test } from "bun:test"
import { createCableClipMesh } from "../lib/models/cableclip"
import { containsMeshPoint } from "./fixtures/assert-shaft-mount-geometry"
import { props } from "./fixtures/cableclip-case"

test("cableclip keeps the nominal cable circle clear between tessellated arc vertices", () => {
  const mesh = createCableClipMesh(props)
  for (const degrees of [91, 131, 179, 223, 269]) {
    const angle = (degrees * Math.PI) / 180
    const radius = props.cableDiameter / 2 - 0.00005
    expect(
      containsMeshPoint(mesh, [
        radius * Math.cos(angle),
        0,
        props.height / 2 + radius * Math.sin(angle),
      ]),
    ).toBe(false)
  }
})
