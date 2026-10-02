import { expect, test } from "bun:test"
import { createElement } from "react"
import { Smd2920P185TF } from "../../lib/Smd2920P185TF"
import { renderComponentContactSheet } from "../helpers/component-model"
import "../fixtures/png-matcher"

test("SMD2920P185TF: six views", async () => {
  await expect(
    await renderComponentContactSheet(createElement(Smd2920P185TF)),
  ).toMatchPngSnapshot(import.meta.path, "smd2920p185tf")
}, 30000)
