import { JsCadView, Translate } from "jscad-fiber"
import { JSTPH2mm, JSTSH1mm, JSTSmd, JSTZH1_5mm } from "../lib"

export default function Example() {
  return (
    <JsCadView zAxisUp showGrid>
      <Translate offset={[-12, 0, 0]}>
        <JSTPH2mm numPins={4} />
      </Translate>
      <Translate offset={[-4, 0, 0]}>
        <JSTSH1mm numPins={4} />
      </Translate>
      <Translate offset={[5, 0, 0]}>
        <JSTZH1_5mm numPins={4} />
      </Translate>
      <Translate offset={[14, 0, 0]}>
        <JSTSmd numPins={4} mountPadPitchX={8} />
      </Translate>
    </JsCadView>
  )
}
