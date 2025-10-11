import { JsCadView, Translate } from "jscad-fiber"

import { A0402 } from "../lib/A0402"

export default () => {
  return (
    <JsCadView zAxisUp showGrid>
      <Translate offset={[-2, 0, 0]}>
        <A0402 />
      </Translate>

      <Translate offset={[0, 0, 0]}>
        <A0402 color="#283046" />
      </Translate>

      <Translate offset={[2, 0, 0]}>
        <A0402
          colors={{
            center: "#2e3440",
            leftTerminal: "#bf616a",
            rightTerminal: "#88c0d0",
          }}
        />
      </Translate>
    </JsCadView>
  )
}
