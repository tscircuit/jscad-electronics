import { Footprinter3d } from "../Footprinter3d"
import { h } from "./h"
import { render, type RenderResult } from "./render"

export function getJscadModelForFootprint(footprint: string): RenderResult {
  const vnode = h(Footprinter3d, { footprint })
  return render(vnode)
}
