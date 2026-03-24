import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import * as React from "react"
import { renderComponentTopView } from "../fixtures/renderComponentTopView"
import { JSXH2_5mm } from "../../lib/JSXH2_5mm"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

test("JSXH 2.5mm component", async () => {
  const element = (
    <>
      <Colorize color="#4c8c2b">
        <Translate offset={[0, 0, -0.5]}>
          <Cuboid size={[20, 20, 1]} center={[0, 0, 0]} />
        </Translate>
      </Colorize>
      <JSXH2_5mm numPins={4} />
    </>
  )
  const pngBuffer = await renderComponentTopView(element)
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
