import { importVanilla } from "./importVanilla.js"
import { fp } from "@tscircuit/footprinter"
import { h, Fragment } from "lib/vanilla/h"
import { render, type RenderResult } from "lib/vanilla/render"
import {
  Colorize,
  Cuboid,
  Translate,
  Cylinder,
  Subtract,
} from "lib/vanilla/primitives"
import type * as jscadModeling from "@jscad/modeling"
import type { AnyCircuitElement } from "circuit-json"

function renderExtrudedPads(footprint: string) {
  const circuitJson = fp.string(footprint).circuitJson() as AnyCircuitElement[]

  const padNodes: any[] = []
  const holeNodes: any[] = []

  for (const elm of circuitJson) {
    if (elm.type === "pcb_smtpad") {
      const pad = elm as any
      if (pad.shape === "rect") {
        const isPin1 = pad.port_hints?.includes("1")
        const color: [number, number, number] = isPin1
          ? [0, 255, 0]
          : [255, 0, 0]
        padNodes.push(
          h(
            Colorize,
            { color },
            h(
              Translate,
              { offset: [pad.x, pad.y, -0.005] },
              h(Cuboid, { size: [pad.width, pad.height, 0.01] }),
            ),
          ),
        )
      }
    } else if (elm.type === "pcb_plated_hole") {
      const hole = elm as any
      const isPin1 = hole.port_hints?.includes("1")
      const color = isPin1 ? "#00ff00" : "#b87333"

      if (hole.shape === "circle") {
        holeNodes.push(
          h(
            Colorize,
            { color },
            h(
              Translate,
              { offset: [hole.x, hole.y, -0.005] },
              h(
                Subtract,
                {},
                h(Cylinder, { radius: hole.outer_diameter / 2, height: 0.01 }),
                h(Cylinder, { radius: hole.hole_diameter / 2, height: 0.01 }),
              ),
            ),
          ),
        )
      } else if (hole.shape === "circular_hole_with_rect_pad") {
        holeNodes.push(
          h(
            Colorize,
            { color },
            h(
              Translate,
              { offset: [hole.x, hole.y, 0] },
              h(
                Subtract,
                {},
                h(Cuboid, {
                  size: [hole.rect_pad_width, hole.rect_pad_width, 0.01],
                  center: [0, 0, 0],
                }),
                h(Cylinder, { radius: hole.hole_diameter / 2, height: 0.01 }),
              ),
            ),
          ),
        )
      }
    }
  }

  return h(Fragment, {}, ...padNodes, ...holeNodes)
}

export async function getJscadModelForFootprintWithPads(
  footprint: string,
  jscad: typeof jscadModeling,
): Promise<RenderResult> {
  // Get the component body from the vanilla build (which has jscad-fiber transformed)
  const { getJscadModelForFootprint } = await importVanilla()
  const bodyResult = getJscadModelForFootprint(footprint, jscad)

  // Get the pads using vanilla primitives
  const padsVNode = renderExtrudedPads(footprint)
  const padsResult = render(padsVNode, jscad)

  // Combine both results
  return {
    geometries: [...bodyResult.geometries, ...padsResult.geometries],
  }
}
