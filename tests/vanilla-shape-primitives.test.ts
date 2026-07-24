import { expect, test } from "bun:test"
import { h } from "../lib/vanilla/h"
import { render } from "../lib/vanilla/render"
import { Cuboid } from "../lib/vanilla/primitives"
import * as jscadModeling from "@jscad/modeling"

// Cuboid (and other shape primitives) throw "center must be an array of X, Y
// and Z values" when center is passed as {x,y,z} instead of [x,y,z]. The
// Translate handler normalizes both forms via toVec3() but the shape
// primitives pass center directly to @jscad/modeling primitives, which
// require an Array (checked by isNumberArray).
test.failing("Cuboid renders with object-form center without throwing", () => {
  const vnode = h(Cuboid, {
    center: { x: 0, y: 0, z: 0.5 },
    size: [2, 2, 1],
  })
  expect(() => render(vnode, jscadModeling)).not.toThrow()
})
