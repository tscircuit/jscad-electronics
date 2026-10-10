import { expect, test } from "bun:test"
import { createSlottedChannelMesh } from "../lib/models/slottedchannel"
import { props, checkMesh } from "./fixtures/slottedchannel"
test("slottedchannel 5: circular-slot and sharp-inside-bend alternatives remain closed", () => {
  checkMesh(createSlottedChannelMesh({ ...props, slotLength: props.slotWidth }))
  checkMesh(
    createSlottedChannelMesh({
      ...props,
      innerRadius: 0,
      slotCount: 1,
      length: 40,
    }),
  )
})
