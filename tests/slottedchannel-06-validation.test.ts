import { expect, test } from "bun:test"
import { createSlottedChannelGeom } from "../lib/models/slottedchannel"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 6: geometry rejects impossible fitting dimensions", () => {
  expect(() => createSlottedChannelGeom({ ...props, width: 12 })).toThrow()
})
