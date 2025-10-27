import type { PcbPlatedHole } from "circuit-json"
import { Colorize, Cuboid, Translate, Cylinder, Subtract } from "jscad-fiber"

export const FootprintPlatedHole = ({ hole }: { hole: PcbPlatedHole }) => {
  if (hole.shape === "circle" || String(hole.shape).includes("circular")) {
    const h = hole as unknown as Record<string, number | undefined>
    const outer = h.outer_diameter ?? h.outerDiameter ?? h.diameter ?? 0
    const inner = h.hole_diameter ?? h.holeDiameter ?? h.hole ?? h.diameter ?? 0
    const outerRadius = outer / 2
    const innerRadius = inner / 2

    return (
      <Colorize color="#b87333">
        <Translate offset={[hole.x, hole.y, 0]}>
          {/* <Rotate axis="z" angle={90}> */}
          <Subtract>
            <Cylinder radius={outerRadius} height={0.01} />
            <Cylinder radius={innerRadius} height={0.01} />
          </Subtract>
          {/* </Rotate> */}
        </Translate>
      </Colorize>
    )
  }
  throw new Error("Shape not supported: " + hole.shape)
}
