import { JsCadView, Translate } from "jscad-fiber"
import { ExtrudedPads, Footprinter3d } from "../../lib"

const variants = [
  { footprint: "jst4_ph", offset: [-5, 0, 0] as [number, number, number] },
  { footprint: "jst4_zh", offset: [5, 0, 0] as [number, number, number] },
]

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      {variants.map(({ footprint, offset }) => (
        <Translate key={footprint} offset={offset}>
          <Footprinter3d footprint={footprint} />
          <ExtrudedPads footprint={footprint} />
        </Translate>
      ))}
    </JsCadView>
  )
}
