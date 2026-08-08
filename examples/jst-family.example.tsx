import { JsCadView, Translate } from "jscad-fiber"
import { JSTPH2mm, JSTZH1_5mm } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <Translate offset={[-5, 0, 0]}>
        <JSTPH2mm numPins={4} />
      </Translate>
      <Translate offset={[5, 0, 0]}>
        <JSTZH1_5mm numPins={4} />
      </Translate>
    </JsCadView>
  )
}
