import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import * as React from "react"
import { JSTZH1_5mm } from "../../lib/JSTZH1_5mm"
import { renderComponent } from "../fixtures/render-component"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

test("JSTZH 1.5mm component", async () => {
  const element = (
    <>
      <Colorize color="#4c8c2b">
        <Translate offset={[0, 0, -0.5]}>
          <Cuboid size={[20, 20, 1]} center={[0, 0, 0]} />
        </Translate>
      </Colorize>
      <JSTZH1_5mm numPins={7} />
    </>
  )
  const pngBuffer = await renderComponent(element)
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
